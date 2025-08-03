import uuid
from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from marshmallow import ValidationError
from app.models import User, LostItem, FoundItem, UrgencyLevel
from app.config import db
from app.schema import UserSchema, LostItemSchema, FoundItemSchema
from datetime import datetime, timedelta
from sqlalchemy import text
from time import time
from app.config import db
from flask import Blueprint
import re
from sqlalchemy.exc import SQLAlchemyError
import os

user_schema = UserSchema()
lost_item_schema = LostItemSchema()
found_item_schema = FoundItemSchema()
lost_items_schema = LostItemSchema(many=True)
found_items_schema = FoundItemSchema(many=True)


class TestAPI(Resource):
    def get(self):
        now = datetime.now().isoformat()

        start = time()
        try:
            db.session.execute(text("SELECT 1"))  # type: ignore
            db_ok = True
        except Exception as e:
            print(e)
            db_ok = False
        end = time()

        return jsonify(
            {
                "timestamp": now,
                "db_status": "OK" if db_ok else "ERROR",
                "db_ping_time_ms": round((end - start) * 1000, 2),
            }
        )


def normalize_kenyan_phone(phone: str) -> str:
    if not phone:
        return ""

    phone = phone.strip().replace(" ", "").replace("-", "")

    if phone.startswith("07") and len(phone) == 10:
        return "+254" + phone[1:]
    elif phone.startswith("7") and len(phone) == 9:
        return "+254" + phone
    elif phone.startswith("254") and len(phone) == 12:
        return "+" + phone
    elif phone.startswith("+254") and len(phone) == 13:
        return phone
    else:
        return ""


class Register(Resource):
    def post(self):
        EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        data = request.get_json()

        errors = user_schema.validate(data)
        if errors:
            return {"errors": errors}, 400

        if not re.match(EMAIL_REGEX, data.get("email", "")):
            return {"message": "Invalid email format."}, 400

        email: str = data.get("email", "")
        full_name = data.get("full_name", "")
        role = data.get("role", "")
        student_staff_id = data.get("student_staff_id")
        phone = data.get("phone")
        password = data.get("password")

        if not all([email, full_name, role, student_staff_id, phone, password]):
            return {
                "message": "All fields are required: email, full_name, role, student_staff_id, phone, password"
            }, 400

        if User.query.filter_by(email=email).first():
            return {"message": "User already exists"}, 400

        user = User(
            full_name=full_name,
            email=email.lower().strip(),
            role=role,
            student_staff_id=student_staff_id,
            phone=normalize_kenyan_phone(phone),
            active=False if data["role"] == "Staff" else True,
        )
        user.set_password(password)

        try:
            db.session.add(user)
            db.session.commit()
            return {"message": "User created successfully"}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Internal server error {e}"}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()

        if (
            not data
            or not data.get("email").strip()
            or not data.get("password").strip()
        ):
            return {"message": "Email and password are required."}, 400

        email = data.get("email").lower().strip()
        password = data.get("password").strip()

        user = User.query.filter_by(email=email).first()
        print(f"User found: {user}")

        if user and user.check_password(password):
            # Check if the user is active
            # if user.active is False:
            #     return {
            #         "message": "Account is not active. Please contact support."
            #     }, 403
            access_token = create_access_token(
                identity=user.email,
                expires_delta=timedelta(days=1),
                additional_claims={"role": user.role},
            )
            return {"access_token": access_token}, 200

        return {"message": "Invalid credentials"}, 401


class Profile(Resource):
    @jwt_required()
    def get(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        if not user:
            return {"message": "User not found"}, 404
        return user_schema.dump(user), 200

    @jwt_required()
    def put(self):
        user = User.query.get(get_jwt_identity())
        data = request.get_json()
        if "password" in data:
            user.set_password(data["password"])
        if "full_name" in data:
            user.full_name = data["full_name"]
        if "phone" in data:
            user.phone = data["phone"]
        db.session.commit()
        return {"message": "Profile updated"}, 200


class AllUsers(Resource):
    @jwt_required()
    def get(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        if not user:
            return {"message": "User not found"}, 404
        if user.role != "Staff":
            return {"message": "Forbidden Access"}, 403
        users = User.query.all()
        return user_schema.dump(users, many=True), 200


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
UPLOAD_FOLDER = os.path.join("static", "uploads")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class LostItemReport(Resource):
    # get all reported lost items
    def get(self):
        pagination = LostItem.query.paginate(
            page=request.args.get("page", 1, type=int),
            per_page=request.args.get("per_page", 10, type=int),
            error_out=False,
        )

        items = pagination.items

        return {
            "items": lost_items_schema.dump(items),
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        }, 200

    @jwt_required()
    def post(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        user_id = user.id if user else None
        if not user_id:
            return {"message": "User not found"}, 404

        form = request.form
        image = request.files.get("image")

        # Extract and sanitize
        title = form.get("title", "").strip()
        description = form.get("description", "").strip()
        category = form.get("category", "").strip()
        last_seen_location = form.get("last_seen_location", "").strip()
        date_str = form.get("date", "").strip()
        urgency_str = form.get("urgency", "").strip().upper()

        # Validate required fields
        if not all(
            [title, description, category, date_str, urgency_str, last_seen_location]
        ):
            return {
                "message": "All fields are required: title, description, category, date, urgency, last_seen_location"
            }, 400

        # Validate urgency enum
        if urgency_str not in "LOW MEDIUM HIGH CRITICAL".split():
            return {
                "message": "Invalid urgency level. Must be one of: Low, Medium, High, Critical."
            }, 400

        # Validate date
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
            if date > datetime.now():
                return {"message": "Date cannot be in the future."}, 400
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        # Handle image upload
        image_filename = None
        if image and allowed_file(image.filename):
            ext = image.filename.rsplit(".", 1)[1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure folder exists
            image.save(filepath)
            image_filename = filename
        elif image:
            return {"message": "Invalid image file type."}, 400

        # Create item
        item = LostItem(
            title=title,
            description=description,
            category=category,
            last_seen_location=last_seen_location,
            date=date,
            urgency=urgency_str,
            user_id=user_id,
            image=image_filename,
        )

        try:
            db.session.add(item)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"message": f"Database error while reporting item: {e}"}, 500

        return {
            "message": "Lost item reported",
            "item": lost_item_schema.dump(item),
        }, 201

    @jwt_required()
    def put(self, item_id):
        user_id = get_jwt_identity()
        item = LostItem.query.get_or_404(item_id)
        if item.user_id != user_id:
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        for key in [
            "title",
            "description",
            "category",
            "last_seen_location",
            "urgency",
        ]:
            setattr(item, key, data.get(key, getattr(item, key)))
        if data.get("status") == "found":
            item.status = "found"
        db.session.commit()
        return {"message": "Item updated", "item": lost_item_schema.dump(item)}, 200

    @jwt_required()
    def delete(self, item_id):
        user_id = get_jwt_identity()
        item = LostItem.query.get_or_404(item_id)
        if item.user_id != user_id:
            return {"message": "Unauthorized"}, 403

        db.session.delete(item)
        db.session.commit()
        return {"message": "Item deleted"}, 200


class LostItemDetail(Resource):
    @jwt_required()
    def get(self, item_id):
        item = LostItem.query.get(item_id)
        if not item:
            return {"message": "Item not found"}, 404
        return lost_item_schema.dump(item), 200


class FoundItemReport(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        raw_data = request.get_json()

        if raw_data:
            for key in ["description", "category", "found_location"]:
                if key in raw_data and isinstance(raw_data[key], str):
                    raw_data[key] = raw_data[key].strip()

        try:
            data = found_item_schema.load(raw_data)
        except ValidationError as err:
            return {"errors": err.messages}, 400

        try:
            date = datetime.strptime(raw_data["date"], "%Y-%m-%d")
        except (KeyError, ValueError):
            return {"message": "Invalid or missing date. Use format YYYY-MM-DD."}, 400

        item = FoundItem(
            description=data["description"],
            category=data["category"],
            found_location=data.get("found_location"),
            date=date,
            user_id=user_id,
        )

        try:
            db.session.add(item)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error while reporting item."}, 500

        return {
            "message": "Found item reported",
            "item": found_item_schema.dump(item),
        }, 201


class ItemList(Resource):
    def get(self):
        category = request.args.get("category", type=str)
        status = request.args.get("status", default="all", type=str).lower()

        results = []

        if status not in ["lost", "found", "all"]:
            return {
                "message": "Invalid status. Must be 'lost', 'found', or 'all'."
            }, 400

        if status in ["lost", "all"]:
            query = LostItem.query
            if category:
                query = query.filter(LostItem.category.ilike(category.strip()))
            results.extend(query.all())

        if status in ["found", "all"]:
            query = FoundItem.query
            if category:
                query = query.filter(FoundItem.category.ilike(category.strip()))
            results.extend(query.all())

        output = []
        for item in results:
            if isinstance(item, LostItem):
                serialized = lost_item_schema.dump(item)
                serialized["type"] = "LostItem"
            else:
                serialized = found_item_schema.dump(item)
                serialized["type"] = "FoundItem"
            output.append(serialized)

        return output, 200
