from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ---------------------
# User Model
# ---------------------
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True) 
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')
    student_id = db.Column(db.String(50), nullable=True)
    profile_photo = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "student_id": self.student_id,
            "role": self.role,
            "phone": self.phone,
            "profile_photo": self.profile_photo,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    # Relationships
    lost_items = db.relationship("LostItem", backref="owner", foreign_keys='LostItem.user_id')
    found_items = db.relationship("FoundItem", backref="owner", foreign_keys='FoundItem.user_id')

    messages_sent = db.relationship("Message", backref="sender", foreign_keys='Message.sender_id')
    messages_received = db.relationship("Message", backref="receiver", foreign_keys='Message.receiver_id')

    claims = db.relationship("Claim", backref="claimant", foreign_keys='Claim.claimant_id')
    rewards = db.relationship("Reward", backref="user", foreign_keys='Reward.user_id')

    notifications = db.relationship("Notification", backref="user")
    comments = db.relationship("Comment", backref="user")


# ---------------------
# LostItem Model
# ---------------------
class LostItem(db.Model):
    __tablename__ = 'lost_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)  
    location = db.Column(db.String(255))  
    category = db.Column(db.String(50))
    date = db.Column(db.Date, nullable=False)
    urgency = db.Column(db.String(20))
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------
class FoundItem(db.Model):
    __tablename__ = 'found_items'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    location_found = db.Column(db.String(255))
    date_found = db.Column(db.Date)
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    reward = db.relationship("Reward", back_populates="found_item", uselist=False)


# ---------------------
# Claim Model
# ---------------------
class Claim(db.Model):
    __tablename__ = 'claims'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    questionnaire_answers = db.Column(db.Text)
    proof_document = db.Column(db.String(255)) 
    status = db.Column(db.String(20), default="Pending") 
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------
# Reward Model
# ---------------------
class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # This is the missing part:
    item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'), nullable=False)

    amount = db.Column(db.Float, nullable=False)
    conditions = db.Column(db.String)

    # Define relationship back to FoundItem
    found_item = db.relationship('FoundItem', back_populates='reward')

    def serialize(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "amount": self.amount,
            "conditions": self.conditions
        }



# ---------------------
# Message Model
# ---------------------
class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    text = db.Column(db.Text)
    file_attachment = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------
# Notification Model
# ---------------------
class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    message = db.Column(db.String(255))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------
# Comment Model
# ---------------------
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('found_items.id'))

    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
