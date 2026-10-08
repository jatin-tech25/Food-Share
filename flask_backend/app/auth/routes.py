from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    full_name = data.get('fullName')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role')

    if not all([full_name, email, phone, password, role]):
        return jsonify({'error': 'Name, email, phone, password, and role are required'}), 400

    if role == 'admin':
        return jsonify({'error': 'Public admin registration is not permitted'}), 403

    if role not in ['provider', 'ngo', 'volunteer']:
        return jsonify({'error': 'Invalid role'}), 400

    email_clean = email.strip().lower()
    if User.query.filter_by(email=email_clean).first():
        return jsonify({'error': 'Email address already exists'}), 409

    user = User(
        full_name=full_name.strip(),
        email=email_clean,
        phone=phone.strip(),
        role=role,
        organization_name=data.get('organizationName'),
        organization_type=data.get('organizationType'),
        address=data.get('address'),
        city=data.get('city'),
        postal_code=data.get('postalCode'),
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    return jsonify({'user': user.to_dict(), 'message': 'Registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    if user.account_status == 'suspended':
        return jsonify({'error': 'Account suspended'}), 403

    session['user_id'] = user.id
    return jsonify({'user': user.to_dict(), 'message': 'Logged in successfully'})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Logged out'})

@auth_bp.route('/me', methods=['GET'])
def get_me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'user': None})
    user = User.query.get(user_id)
    return jsonify({'user': user.to_dict() if user else None})
