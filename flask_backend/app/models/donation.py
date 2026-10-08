from datetime import datetime, timezone
from app.extensions import db

class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    food_name = db.Column(db.String(150), nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    remaining_quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(30), nullable=False, default='portions')
    estimated_portions = db.Column(db.Integer, nullable=False, default=1)
    is_vegetarian = db.Column(db.Boolean, default=False)
    preparation_time = db.Column(db.DateTime, nullable=False)
    pickup_start = db.Column(db.DateTime, nullable=False)
    pickup_deadline = db.Column(db.DateTime, nullable=False, index=True)
    pickup_address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(80), nullable=False, index=True)
    postal_code = db.Column(db.String(20), nullable=False)
    storage_information = db.Column(db.String(255), nullable=True)
    allergen_information = db.Column(db.String(255), nullable=True)
    packaging_details = db.Column(db.String(255), nullable=True)
    image_path = db.Column(db.String(255), nullable=True)
    special_instructions = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), nullable=False, default='Available', index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    requests = db.relationship('FoodRequest', backref='donation', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': str(self.id),
            'providerId': str(self.provider_id),
            'providerName': self.provider.organization_name or self.provider.full_name if self.provider else 'Provider',
            'foodName': self.food_name,
            'category': self.category,
            'description': self.description,
            'quantity': self.quantity,
            'remainingQuantity': self.remaining_quantity,
            'unit': self.unit,
            'estimatedPortions': self.estimated_portions,
            'isVegetarian': self.is_vegetarian,
            'preparationTime': self.preparation_time.isoformat() if self.preparation_time else None,
            'pickupStart': self.pickup_start.isoformat() if self.pickup_start else None,
            'pickupDeadline': self.pickup_deadline.isoformat() if self.pickup_deadline else None,
            'pickupAddress': self.pickup_address,
            'city': self.city,
            'postalCode': self.postal_code,
            'storageInformation': self.storage_information,
            'allergenInformation': self.allergen_information,
            'packagingDetails': self.packaging_details,
            'imagePath': self.image_path,
            'specialInstructions': self.special_instructions,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
