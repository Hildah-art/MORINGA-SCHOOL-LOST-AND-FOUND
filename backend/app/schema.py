from app.config import ma
from marshmallow import fields, validate
from app.models import User, LostItem, FoundItem, Message, Comment


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
        # exclude = ("password_hash",)

    id = ma.auto_field()
    full_name = ma.auto_field()
    email = ma.auto_field()
    student_staff_id = ma.auto_field()
    phone = ma.auto_field()
    role = fields.Function(
        serialize=lambda obj: obj.role.value if obj.role else None,
        deserialize=lambda val: val.strip().upper(),
        required=True,
        validate=validate.OneOf(["STUDENT", "STAFF", "ADMIN"]),
    )
    profile_photo = ma.auto_field()
    created_at = ma.auto_field()
    updated_at = ma.auto_field()
    active = ma.auto_field()
    password = fields.String(
        load_only=True, required=True, validate=validate.Length(min=8)
    )


class CommentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Comment

    id = ma.auto_field()
    content = ma.auto_field()
    timestamp = ma.auto_field()
    user_id = ma.auto_field()


class LostItemSchema(ma.SQLAlchemySchema):
    class Meta:
        model = LostItem
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    description = ma.auto_field()
    category = ma.auto_field()
    last_seen_location = ma.auto_field()
    date = ma.auto_field()
    image = ma.auto_field()
    urgency = fields.Function(
        deserialize=lambda val: val.strip().upper(),
        required=True,
        validate=validate.OneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    )
    status = ma.auto_field()
    user_id = ma.auto_field()
    user = fields.Nested(UserSchema(only=("student_staff_id", "full_name", "email")))
    comments = ma.Nested(CommentSchema, many=True)


class FoundItemSchema(ma.SQLAlchemySchema):
    class Meta:
        model = FoundItem
        load_instance = True

    id = ma.auto_field()
    description = ma.auto_field()
    category = ma.auto_field()
    found_location = ma.auto_field()
    date = ma.auto_field()
    image = ma.auto_field()
    status = ma.auto_field()
    user_id = ma.auto_field()
    user = fields.Nested(UserSchema(only=("id", "full_name", "email")))


class MessageSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Message
        load_instance = True

    id = ma.auto_field()
    content = ma.auto_field()
    timestamp = ma.auto_field()
    sender_id = ma.auto_field()
    receiver_id = ma.auto_field()
    sender = fields.Nested(UserSchema(only=("id", "full_name", "email")))
    receiver = fields.Nested(UserSchema(only=("id", "full_name", "email")))
