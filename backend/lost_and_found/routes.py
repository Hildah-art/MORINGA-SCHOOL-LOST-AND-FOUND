import os
from flask import Blueprint, request, jsonify, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.security import check_password_hash
from .models import db, User, LostItem, FoundItem, Claim, Message, Notification, Reward, Comment
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask import render_template

routes = Blueprint('routes', __name__)




# -------------------- USERS --------------------
@routes.route('/users/<int:id>', methods=['GET'])
def get_user_by_id(id):
    user = User.query.get(id)
    if user:
        return jsonify(user.serialize()), 200
    return jsonify({"error": "User not found"}), 404


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
        os.makedirs(upload_folder, exist_ok=True)  

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


@routes.route('/profile', methods=['GET'])
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
    
    # Debug: print the received login data
    print("Login data received:", data)

    # Step 1: Query for user
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        print("User not found for email:", data['email'])
        return jsonify({'error': 'User not found'}), 404

    # Step 2: Check password
    try:
        valid_password = check_password_hash(user.password_hash, data['password'])
    except Exception as e:
        print("Error during password check:", str(e))
        return jsonify({'error': 'Password check failed'}), 500

    if not valid_password:
        print("Invalid password for user:", data['email'])
        return jsonify({'error': 'Invalid credentials'}), 401

    # Step 3: Return success
    print("Login successful for:", user.email)
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }), 200
