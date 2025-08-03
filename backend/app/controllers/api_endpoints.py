import re
import uuid
from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from marshmallow import ValidationError
from app.models import User, LostItem, FoundItem, UrgencyLevel
from dateutil.parser import parse as parse_date
from app.config import db
from app.schema import UserSchema, LostItemSchema, FoundItemSchema
from datetime import datetime, timedelta
from sqlalchemy import text
from time import time
from app.config import db
from sqlalchemy.exc import SQLAlchemyError
import os


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
UPLOAD_FOLDER = os.path.join("static", "uploads")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def clean_and_parse_date(date_str):
    cleaned = re.sub(r"GMT[+-]\d{4}.*$", "", date_str).strip()
    return parse_date(cleaned)


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


class AllUsers(Resource):
    @jwt_required()
    def get(self):
        user = User.query.filter_by(email=get_jwt_identity()).first()
        print(user)
        if not user:
            return {"message": "User not found"}, 404
        if user.role.value != "STAFF":
            return {"message": "Forbidden Access"}, 403
        users = User.query.all()
        return user_schema.dump(users, many=True), 200


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

        try:
            date = clean_and_parse_date(date_str)
            if date > datetime.now():
                return {"message": "Date cannot be in the future."}, 400
        except Exception:
            return {"message": f"Invalid date format: {date_str}"}, 400

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
