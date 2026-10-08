from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.donation import Donation
from app.models.request_and_assignment import FoodRequest, VolunteerAssignment
from app.models.user import User

requests_bp = Blueprint('requests', __name__)

@requests_bp.route('', methods=['GET'])
def list_requests():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    user = User.query.get(user_id)

    if user.role == 'ngo':
        reqs = FoodRequest.query.filter_by(ngo_id=user.id).all()
    elif user.role == 'provider':
        provider_donations = Donation.query.filter_by(provider_id=user.id).all()
        don_ids = [d.id for d in provider_donations]
        reqs = FoodRequest.query.filter(FoodRequest.donation_id.in_(don_ids)).all() if don_ids else []
    else:
        reqs = FoodRequest.query.all()

    return jsonify({'requests': [r.to_dict() for r in reqs]})

@requests_bp.route('/<int:donation_id>', methods=['POST'])
def create_request(donation_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    if not user or (user.role != 'ngo' and user.role != 'admin'):
        return jsonify({'error': 'Only registered NGOs can submit food requests'}), 403

    donation = Donation.query.get_or_404(donation_id)
    data = request.get_json() or {}
    qty = float(data.get('requestedQuantity', 0))

    if qty <= 0:
        return jsonify({'error': 'Quantity must be greater than zero'}), 400

    if qty > donation.remaining_quantity:
        return jsonify({'error': f'Requested quantity exceeds remaining ({donation.remaining_quantity})'}), 400

    freq = FoodRequest(
        donation_id=donation.id,
        ngo_id=user.id,
        requested_quantity=qty,
        message=data.get('message', ''),
        distribution_plan=data.get('distributionPlan', ''),
        status='Pending'
    )
    db.session.add(freq)
    db.session.commit()

    return jsonify({'request': freq.to_dict(), 'message': 'Request submitted'}), 201

@requests_bp.route('/<int:request_id>/accept', methods=['POST'])
def accept_request(request_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    freq = FoodRequest.query.get_or_404(request_id)
    donation = Donation.query.get(freq.donation_id)

    if donation.provider_id != user_id:
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Forbidden'}), 403

    if freq.status != 'Pending':
        return jsonify({'error': 'Request is not pending'}), 400

    if freq.requested_quantity > donation.remaining_quantity:
        return jsonify({'error': 'Insufficient remaining quantity'}), 400

    donation.remaining_quantity -= freq.requested_quantity
    donation.status = 'Fully Reserved' if donation.remaining_quantity == 0 else 'Partially Reserved'
    freq.status = 'Accepted'

    # Create assignment
    asg = VolunteerAssignment(
        donation_id=donation.id,
        request_id=freq.id,
        status='Available',
        pickup_address=donation.pickup_address,
        delivery_address=freq.distribution_plan or 'NGO Center',
    )
    db.session.add(asg)
    db.session.commit()

    return jsonify({'message': 'Request accepted', 'request': freq.to_dict(), 'assignment': asg.to_dict()})
