import os
from flask import Blueprint, request, jsonify, url_for
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from .models import db, User, LostItem, FoundItem, Claim, Message, Notification, Reward, Comment
from datetime import datetime
from flask import render_template

routes = Blueprint('routes', __name__)




# -------------------- USERS --------------------
@routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users])

@routes.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    user = User(
        full_name=data['name'],
        email=data['email'],
        phone=data['phone'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201

# -------------------- SIGNUP --------------------
@routes.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'CORS preflight OK'}), 200

    data = request.get_json()

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 409

    new_user = User(
        full_name=data['name'],
        email=data['email'],
        phone=data.get('phone', 'N/A'),
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
    "message": "User created successfully",
    "user": {
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role
        # Add other fields here if needed (avoid password!)
    }
}), 201

# -------------------- LOGIN --------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "full_name": user.name,
                "email": user.email,
                "profile_image": user.profile_image
            }
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401



# -------------------- LOST ITEMS --------------------
@routes.route('/lost-items', methods=['POST'])
def create_lost_item():
    title = request.form.get('title')
    category = request.form.get('category')
    urgency = request.form.get('urgency')
    date = request.form.get('date')
    user_id = request.form.get('user_id')
    description = request.form.get('description')
    location = request.form.get('location')

    image_file = request.files.get('image')
    image_url = None

    if image_file:
        upload_folder = os.path.join('static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)  # ✅ ensure directory exists

        image_path = os.path.join(upload_folder, image_file.filename)
        image_file.save(image_path)
        image_url = f"http://localhost:5000/static/uploads/{image_file.filename}"


    lost_item = LostItem(
        title=title,
        category=category,
        urgency=urgency,
        date=datetime.strptime(date, "%Y-%m-%d").date() if date else None,
        image_url=image_url,
        user_id=user_id,  # ✅ MISSING COMMA FIXED HERE
        description=description,
        location=location,
    )

    db.session.add(lost_item)
    db.session.commit()

    return jsonify({"message": "Lost item created", "item": lost_item.id}), 201

# -------------------- FOUND ITEMS --------------------
@routes.route('/found-items', methods=['POST'])
def create_found_item():
    title = request.form.get('title')  # ✅ matches model
    location_found = request.form.get('location')  # ✅ matches model
    date_found = request.form.get('date_found')  # Format: YYYY-MM-DD
    description = request.form.get('description')
    category = request.form.get('category') 
    user_id = request.form.get('user_id')

    image_file = request.files.get('image')
    image_url = None

    if image_file:
        upload_folder = os.path.join('static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, image_file.filename)
        image_file.save(image_path)
        image_url = f"http://localhost:5000/static/uploads/{image_file.filename}"

    found_item = FoundItem(
        title=title,
        location_found=location_found,
        date_found=datetime.strptime(date_found, "%Y-%m-%d").date() if date_found else None,
        description=description,
        image_url=image_url,
        user_id=user_id
    )

    db.session.add(found_item)
    db.session.commit()

    return jsonify({"message": "Found item created", "item": found_item.id}), 201


@routes.route('/all-items', methods=['GET'])
def get_all_items():
    lost_items = LostItem.query.all()
    found_items = FoundItem.query.all()

    formatted_lost = [{
        "id": item.id,
        "title": item.title,
        "description": item.description or "",
        "image_url": item.image_url or "",  # ← Directly use the full URL
        "location": item.location or "",
        "date": item.date.strftime("%Y-%m-%d") if item.date else "",
        "urgency": item.urgency or "",
        "category": item.category or "",
        "type": "lost"
    } for item in lost_items]

    formatted_found = [{
        "id": item.id,
        "title": item.title,
        "description": item.description or "",
        "image_url": item.image_url or "",  # ← Directly use the full URL
        "location": item.location_found or "",
        "date": item.date_found.strftime("%Y-%m-%d") if item.date_found else "",
        "urgency": "",
        "category": item.category or "",
        "type": "found"
    } for item in found_items]

    return jsonify(formatted_lost + formatted_found), 200

# -------------------- CLAIMS --------------------
@routes.route('/claims', methods=['POST'])
def create_claim():
    data = request.get_json()

    claim = Claim(
        item_id=data['item_id'],
        claimant_id=data['claimant_id'],
        questionnaire_answers=data.get('questionnaire_answers'),
        proof_document=data.get('proof_document'),
        status=data.get('status', 'Pending')
    )
    db.session.add(claim)
    db.session.commit()
    return jsonify({
        "message": "Claim submitted successfully.",
        "claim": {
            "id": claim.id,
            "item_id": claim.item_id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "submitted_at": claim.submitted_at
        }
    }), 201

@routes.route('/claims/<int:claim_id>/status', methods=['PUT'])
def update_claim_status(claim_id):
    claim = Claim.query.get_or_404(claim_id)
    data = request.get_json()
    claim.status = data['status']
    db.session.commit()
    return jsonify({
        "message": "Claim status updated.",
        "claim": {
            "id": claim.id,
            "status": claim.status
        }
    })

# -------------------- NOTIFICATIONS --------------------
@routes.route('/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()
    notif = Notification(
        user_id=data['user_id'],
        message=data['message']
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify(notif.serialize()), 201

@routes.route('/notifications/<int:user_id>', methods=['GET'])
def get_user_notifications(user_id):
    notifs = Notification.query.filter_by(user_id=user_id).all()
    return jsonify([n.serialize() for n in notifs])

# -------------------- REWARDS --------------------
@routes.route('/rewards', methods=['POST'])
def create_reward():
    data = request.get_json()
    reward = Reward(
        item_id=data['item_id'],
        amount=data['amount'],
        conditions=data.get('conditions')
    )
    db.session.add(reward)
    db.session.commit()
    return jsonify(reward.serialize()), 201

@routes.route('/rewards/<int:item_id>', methods=['GET'])
def get_reward(item_id):
    reward = Reward.query.filter_by(item_id=item_id).first()
    if reward:
        return jsonify(reward.serialize())
    return jsonify({"error": "Reward not found"}), 404
#----------------------PROFILE--------------------


@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "full_name": user.name,
            "email": user.email,
            "profile_image": user.profile_image
        }
    }), 200


# -------------------- MESSAGES --------------------
@routes.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    msg = Message(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        content=data['content']
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.serialize()), 201

@routes.route('/messages/<int:user_id>', methods=['GET'])
def get_user_messages(user_id):
    messages = Message.query.filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).all()
    return jsonify([m.serialize() for m in messages])

@routes.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'CORS preflight OK'}), 200

    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }), 200
