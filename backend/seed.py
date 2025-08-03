import os
import random
from datetime import datetime, timedelta, timezone
from app import create_app
from app.models import db, User, LostItem, FoundItem, Comment
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    print("⏳ Seeding data...")

    # === USERS ===
    roles = ["STUDENT", "STAFF", "ADMIN"]
    users = []
    for i in range(10):
        role = random.choice(roles)
        user = User(
            full_name=f"User {i}",
            email=f"user{i}@mail.com",
            password_hash=generate_password_hash("password123"),
            role=role,
            student_staff_id=f"ID-{i}",
            phone=f"0700{random.randint(100000,999999)}",
            active=True if role != "STAFF" else False,
        )
        users.append(user)
        db.session.add(user)

    db.session.commit()

    # === LOST ITEMS ===
    categories = ["shoes", "electronics", "documents", "accessories"]
    lost_items = []
    for i in range(15):
        user = random.choice(users)
        item = LostItem(
            title=f"Lost {random.choice(categories).title()} {i}",
            description=f"Description for lost item {i}",
            category=random.choice(categories),
            last_seen_location="Campus Zone " + str(random.randint(1, 5)),
            date=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30)),
            image="sample.png",
            urgency=random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
            status=random.choice(["LOST", "FOUND", "RETURNED"]),
            user_id=user.id,
        )
        db.session.add(item)
        lost_items.append(item)

    db.session.commit()

    # === FOUND ITEMS ===
    for i in range(10):
        user = random.choice(users)
        item = FoundItem(
            description=f"Found item {i} description",
            title="Found " + random.choice(categories).title() + f" {i}",
            category=random.choice(categories),
            found_location="Library / Cafeteria",
            date=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 15)),
            image="sample.png",
            status="found",
            user_id=user.id,
        )
        db.session.add(item)

    db.session.commit()

    # === COMMENTS ===
    for i in range(20):
        item = random.choice(lost_items)
        user = random.choice(users)
        comment = Comment(
            content=f"Comment {i} on item {item.title}",
            item_id=item.id,
            user_id=user.id,
            timestamp=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 5)),
        )
        db.session.add(comment)

    db.session.commit()

    print("✅ Database seeded successfully.")
