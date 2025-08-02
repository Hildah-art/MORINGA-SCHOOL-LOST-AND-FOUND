from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from .config import db, migrate, jwt, api, ma
from app.routes import auth_bp, items_bp, test_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        os.getenv("DATABASE_URL") or "sqlite:///lostfound.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    if not app.config["JWT_SECRET_KEY"]:
        raise RuntimeError("SECRET_KEY is not set in the environment.")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    api.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(items_bp, url_prefix="/api")
    app.register_blueprint(test_bp, url_prefix="/api")

    return app
