import uuid
from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app.models import User
from app.config import db
from app.schema import UserSchema
from datetime import datetime, timedelta

from app.config import db

import re

import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

user_schema = UserSchema()


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


class ResetPassword(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email", "").strip()

        if not email:
            return {"message": "Email is required."}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found."}, 404
        if resend.api_key is None:
            return {"message": "Email service not configured."}, 500

        reset_token = str(uuid.uuid4())
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=30)
        db.session.commit()

        reset_link = f"http://localhost:5000/api/reset-password?token={reset_token}"

        try:
            resend.Emails.send(
                {
                    "to": f"{user.full_name} <{user.email}>",
                    "from": "Lost and Found <no-reply@lostandfound.com>",
                    "subject": "Password Reset",
                    "html": f"<p>Click <a href='{reset_link}'>here</a> to reset your password. This link expires in 30 minutes.</p>",
                }
            )
        except Exception as e:
            return {"message": f"Failed to send email: {e}"}, 500

        return {"message": "Password reset link sent to your email."}, 200


class ResetPasswordConfirm(Resource):
    def post(self):
        data = request.get_json()
        token = data.get("token", "").strip()
        new_password = data.get("new_password", "").strip()

        if not token or not new_password:
            return {"message": "Token and new password are required."}, 400

        user = User.query.filter_by(reset_token=token).first()
        if not user or user.reset_token_expiry < datetime.utcnow():
            return {"message": "Invalid or expired token."}, 400

        user.set_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()

        return {"message": "Password reset successfully."}, 200


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
