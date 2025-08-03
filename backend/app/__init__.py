import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from .config import db, migrate, jwt, api, ma
from app.routes import auth_bp, items_bp, test_bp

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configs
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        os.getenv("DATABASE_URL") or "sqlite:///lostfound.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    if not app.config["JWT_SECRET_KEY"]:
        raise RuntimeError("SECRET_KEY is not set in the environment.")

    # Uploads
    app.static_folder = "../static"
    app.static_url_path = "/static"
    app.config["UPLOAD_FOLDER"] = os.path.join(app.static_folder, "uploads")

    # Create uploads dir if it doesn't exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Serve /uploads/<filename> directly
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    api.init_app(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(items_bp, url_prefix="/api")
    app.register_blueprint(test_bp, url_prefix="/api")

    return app
