import enum
from sqlalchemy import Enum
from app.config import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Enum as PgEnum


# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(Enum("Student", "Staff", name="user_roles"), nullable=False)
    student_staff_id = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    profile_photo = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    if role == "Staff":
        active = db.Column(db.Boolean, default=False)


class UrgencyLevel(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False, unique=True)
    category = db.Column(db.String(50), nullable=False)
    last_seen_location = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    image = db.Column(db.String(200))
    urgency = db.Column(PgEnum(UrgencyLevel, name="urgency_level"), nullable=False)
    reward = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default="lost")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", backref="lost_items")

    comments = db.relationship("Comment", back_populates="lost_item", lazy="joined")


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("lost_item.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("User", backref="comments")
    lost_item = db.relationship("LostItem", back_populates="comments")


class FoundItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    found_location = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    image = db.Column(db.String(200))
    status = db.Column(db.String(20), default="found")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", backref="found_items")


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    sender = db.relationship("User", foreign_keys=[sender_id])
    receiver = db.relationship("User", foreign_keys=[receiver_id])
