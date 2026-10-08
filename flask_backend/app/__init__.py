import os
from flask import Flask, jsonify
from app.extensions import db, migrate
from app.models import User, Donation, FoodRequest, VolunteerAssignment, Notification, AuditLog, Report

def create_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure instance directory exists
    instance_path = os.path.join(app.root_path, '..', 'instance')
    os.makedirs(instance_path, exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.auth.routes import auth_bp
    from app.donations.routes import donations_bp
    from app.requests.routes import requests_bp
    from app.volunteers.routes import volunteers_bp
    from app.admin.routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(donations_bp, url_prefix='/api/donations')
    app.register_blueprint(requests_bp, url_prefix='/api/requests')
    app.register_blueprint(volunteers_bp, url_prefix='/api/assignments')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy', 'app': 'Food Share Flask API'})

    return app
