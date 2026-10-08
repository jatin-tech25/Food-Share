from datetime import datetime, timezone
from app.extensions import db

class FoodRequest(db.Model):
    __tablename__ = 'food_requests'

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey('donations.id'), nullable=False, index=True)
    ngo_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    requested_quantity = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), nullable=False, default='Pending', index=True)  # Pending, Accepted, Rejected, Fulfilled
    message = db.Column(db.Text, nullable=True)
    distribution_plan = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    assignment = db.relationship('VolunteerAssignment', backref='request', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': str(self.id),
            'donationId': str(self.donation_id),
            'ngoId': str(self.ngo_id),
            'ngoName': self.ngo.organization_name or self.ngo.full_name if self.ngo else 'NGO',
            'requestedQuantity': self.requested_quantity,
            'status': self.status,
            'message': self.message,
            'distributionPlan': self.distribution_plan,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }

class VolunteerAssignment(db.Model):
    __tablename__ = 'volunteer_assignments'

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey('donations.id'), nullable=False, index=True)
    request_id = db.Column(db.Integer, db.ForeignKey('food_requests.id'), nullable=False, index=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    status = db.Column(db.String(30), nullable=False, default='Available', index=True)  # Available, Assigned, Picked Up, Delivered, Completed
    assigned_at = db.Column(db.DateTime, nullable=True)
    picked_up_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    pickup_address = db.Column(db.String(255), nullable=False)
    delivery_address = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': str(self.id),
            'donationId': str(self.donation_id),
            'requestId': str(self.request_id),
            'volunteerId': str(self.volunteer_id) if self.volunteer_id else None,
            'volunteerName': self.volunteer.full_name if self.volunteer else None,
            'status': self.status,
            'pickupAddress': self.pickup_address,
            'deliveryAddress': self.delivery_address,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
