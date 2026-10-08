from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(30), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # provider, ngo, volunteer, admin
    account_status = db.Column(db.String(20), default='active')  # active, suspended
    organization_name = db.Column(db.String(150), nullable=True)
    organization_type = db.Column(db.String(80), nullable=True)
    is_ngo_verified = db.Column(db.Boolean, default=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(80), nullable=True, index=True)
    postal_code = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    donations = db.relationship('Donation', backref='provider', lazy=True, cascade='all, delete-orphan')
    requests = db.relationship('FoodRequest', backref='ngo', lazy=True, cascade='all, delete-orphan')
    assignments = db.relationship('VolunteerAssignment', backref='volunteer', lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'accountStatus': self.account_status,
            'organizationName': self.organization_name,
            'organizationType': self.organization_type,
            'isNgoVerified': self.is_ngo_verified,
            'address': self.address,
            'city': self.city,
            'postalCode': self.postal_code,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
