from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.request_and_assignment import VolunteerAssignment, FoodRequest
from app.models.donation import Donation
from app.models.user import User

volunteers_bp = Blueprint('volunteers', __name__)

@volunteers_bp.route('', methods=['GET'])
def list_assignments():
    user_id = session.get('user_id')
    user = User.query.get(user_id) if user_id else None

    if user and user.role == 'volunteer':
        my_tasks = VolunteerAssignment.query.filter_by(volunteer_id=user.id).all()
        open_tasks = VolunteerAssignment.query.filter_by(status='Available').all()
        return jsonify({
            'myTasks': [t.to_dict() for t in my_tasks],
            'openTasks': [t.to_dict() for t in open_tasks],
        })

    all_tasks = VolunteerAssignment.query.all()
    return jsonify({'assignments': [t.to_dict() for t in all_tasks]})

@volunteers_bp.route('/<int:assignment_id>/claim', methods=['POST'])
def claim_assignment(assignment_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.get(user_id)
    if not user or user.role != 'volunteer':
        return jsonify({'error': 'Only registered volunteers can claim pickup assignments'}), 403

    asg = VolunteerAssignment.query.get_or_404(assignment_id)
    if asg.status != 'Available':
        return jsonify({'error': 'Assignment is no longer available'}), 400

    asg.status = 'Assigned'
    asg.volunteer_id = user.id
    asg.assigned_at = datetime.now(timezone.utc)

    db.session.commit()
    return jsonify({'message': 'Assignment claimed successfully', 'assignment': asg.to_dict()})

@volunteers_bp.route('/<int:assignment_id>/pickup', methods=['POST'])
def pickup_assignment(assignment_id):
    user_id = session.get('user_id')
    asg = VolunteerAssignment.query.get_or_404(assignment_id)
    if asg.volunteer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    asg.status = 'Picked Up'
    asg.picked_up_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({'message': 'Marked as picked up', 'assignment': asg.to_dict()})

@volunteers_bp.route('/<int:assignment_id>/deliver', methods=['POST'])
def deliver_assignment(assignment_id):
    user_id = session.get('user_id')
    asg = VolunteerAssignment.query.get_or_404(assignment_id)
    if asg.volunteer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    asg.status = 'Delivered'
    asg.delivered_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({'message': 'Marked as delivered', 'assignment': asg.to_dict()})
