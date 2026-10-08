from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.donation import Donation
from app.models.user import User

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('', methods=['GET'])
def list_donations():
    category = request.args.get('category')
    city = request.args.get('city')
    search = request.args.get('search')
    status = request.args.get('status', 'Available')

    query = Donation.query
    if status != 'all':
        query = query.filter(Donation.status == status)
    if category and category != 'All':
        query = query.filter(Donation.category == category)
    if city and city != 'All':
        query = query.filter(Donation.city.ilike(f'%{city}%'))
    if search:
        query = query.filter(Donation.food_name.ilike(f'%{search}%'))

    donations = query.order_by(Donation.created_at.desc()).all()
    return jsonify({'donations': [d.to_dict() for d in donations]})

@donations_bp.route('/<int:donation_id>', methods=['GET'])
def get_donation(donation_id):
    donation = Donation.query.get_or_404(donation_id)
    return jsonify({'donation': donation.to_dict()})

@donations_bp.route('', methods=['POST'])
def create_donation():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get(user_id)
    if not user or (user.role != 'provider' and user.role != 'admin'):
        return jsonify({'error': 'Forbidden: Only providers can post donations'}), 403

    data = request.get_json() or {}
    food_name = data.get('foodName')
    category = data.get('category')
    quantity = data.get('quantity')
    pickup_address = data.get('pickupAddress')
    city = data.get('city')

    if not all([food_name, category, quantity, pickup_address, city]):
        return jsonify({'error': 'Missing required fields'}), 400

    now = datetime.now(timezone.utc)
    prep_time = datetime.fromisoformat(data.get('preparationTime')) if data.get('preparationTime') else now
    pickup_start = datetime.fromisoformat(data.get('pickupStart')) if data.get('pickupStart') else now
    pickup_deadline = datetime.fromisoformat(data.get('pickupDeadline')) if data.get('pickupDeadline') else now

    donation = Donation(
        provider_id=user.id,
        food_name=food_name,
        category=category,
        description=data.get('description', ''),
        quantity=float(quantity),
        remaining_quantity=float(quantity),
        unit=data.get('unit', 'portions'),
        estimated_portions=int(data.get('estimatedPortions', quantity)),
        is_vegetarian=bool(data.get('isVegetarian', False)),
        preparation_time=prep_time,
        pickup_start=pickup_start,
        pickup_deadline=pickup_deadline,
        pickup_address=pickup_address,
        city=city,
        postal_code=data.get('postalCode', '90001'),
        storage_information=data.get('storageInformation'),
        allergen_information=data.get('allergenInformation'),
        packaging_details=data.get('packagingDetails'),
        image_path=data.get('imagePath'),
        special_instructions=data.get('specialInstructions'),
        status='Available',
    )

    db.session.add(donation)
    db.session.commit()

    return jsonify({'donation': donation.to_dict(), 'message': 'Donation posted successfully'}), 201
