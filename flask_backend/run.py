import os
from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

@app.cli.command('init-db')
def init_db_command():
    """Initializes and seeds database with default demonstration accounts."""
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(email='admin@foodshare.org').first():
            admin = User(
                full_name='Platform Admin',
                email='admin@foodshare.org',
                phone='+1 555-0199',
                role='admin',
                account_status='active'
            )
            admin.set_password('password123')
            db.session.add(admin)

            provider = User(
                full_name='Chef Marco Rossi',
                email='provider@foodshare.org',
                phone='+1 555-0122',
                role='provider',
                organization_name='Green Garden Bistro',
                city='Metro City'
            )
            provider.set_password('password123')
            db.session.add(provider)

            ngo = User(
                full_name='David Kalu',
                email='ngo@foodshare.org',
                phone='+1 555-0133',
                role='ngo',
                organization_name='Hope & Care Food Bank',
                is_ngo_verified=True,
                city='Metro City'
            )
            ngo.set_password('password123')
            db.session.add(ngo)

            volunteer = User(
                full_name='Alex Rivera',
                email='volunteer@foodshare.org',
                phone='+1 555-0144',
                role='volunteer',
                city='Metro City'
            )
            volunteer.set_password('password123')
            db.session.add(volunteer)

            db.session.commit()
            print("Database initialized and seeded with demo accounts successfully!")
        else:
            print("Database already contains records.")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Food Share Flask server at http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
