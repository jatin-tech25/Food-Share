from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.user import User
from app.models.donation import Donation
from app.models.audit_and_notification import AuditLog, Report

admin_bp = Blueprint('admin', __name__)

def require_admin():
    user_id = session.get('user_id')
    if not user_id:
        return None
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return None
    return user

@admin_bp.route('/users', methods=['GET'])
def list_users():
    admin = require_admin()
    if not admin:
        return jsonify({'error': 'Forbidden: Admin access required'}), 403
    users = User.query.all()
    return jsonify({'users': [u.to_dict() for u in users]})

@admin_bp.route('/organizations/<int:user_id>/verify', methods=['POST'])
def verify_org(user_id):
    admin = require_admin()
    if not admin:
        return jsonify({'error': 'Forbidden: Admin access required'}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    user.is_ngo_verified = bool(data.get('isVerified', True))
    db.session.commit()
    return jsonify({'message': 'Organization verification updated', 'user': user.to_dict()})

@admin_bp.route('/analytics', methods=['GET'])
def get_analytics():
    total_users = User.query.count()
    total_donations = Donation.query.count()
    completed_donations = Donation.query.filter_by(status='Completed').count()
    return jsonify({
        'totalUsers': total_users,
        'totalDonations': total_donations,
        'completedDonations': completed_donations,
    })
