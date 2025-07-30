from flask import Flask
from flask_cors import CORS
from .models import db, User, LostItem, FoundItem, Claim, Message, Notification, Reward, Comment
from .routes import routes

app = Flask(__name__)

# ✅ Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Enable CORS globally
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ✅ Initialize and create DB tables
db.init_app(app)
with app.app_context():
    db.create_all()

# ✅ Register your blueprint routes
app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(debug=True)
