from datetime import datetime, timezone
from app.extensions import db

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='info')
    link_url = db.Column(db.String(255), nullable=True)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': str(self.id),
            'userId': str(self.user_id),
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'linkUrl': self.link_url,
            'isRead': self.is_read,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(80), nullable=False, index=True)
    performed_by_user_id = db.Column(db.Integer, nullable=True)
    performed_by_user_name = db.Column(db.String(120), nullable=True)
    target_entity = db.Column(db.String(50), nullable=False)
    target_id = db.Column(db.String(50), nullable=False)
    details = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': str(self.id),
            'action': self.action,
            'performedByUserId': str(self.performed_by_user_id) if self.performed_by_user_id else None,
            'performedByUserName': self.performed_by_user_name,
            'targetEntity': self.target_entity,
            'targetId': self.target_id,
            'details': self.details,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, nullable=True)
    reported_by_user_id = db.Column(db.Integer, nullable=False)
    reported_by_user_name = db.Column(db.String(120), nullable=False)
    reason = db.Column(db.String(120), nullable=False)
    details = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='pending')
    admin_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': str(self.id),
            'donationId': str(self.donation_id) if self.donation_id else None,
            'reportedByUserId': str(self.reported_by_user_id),
            'reportedByUserName': self.reported_by_user_name,
            'reason': self.reason,
            'details': self.details,
            'status': self.status,
            'adminNotes': self.admin_notes,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
