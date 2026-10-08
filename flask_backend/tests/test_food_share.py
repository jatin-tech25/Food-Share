import pytest
from app import create_app
from app.extensions import db
from app.models.user import User

@pytest.fixture
def app():
    app = create_app('config.TestConfig')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_user_registration(client):
    res = client.post('/api/auth/register', json={
        'fullName': 'Test Provider',
        'email': 'provider_test@example.com',
        'phone': '+1 555-1234',
        'password': 'password123',
        'role': 'provider'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['user']['email'] == 'provider_test@example.com'

def test_duplicate_email_rejected(client):
    client.post('/api/auth/register', json={
        'fullName': 'Original User',
        'email': 'duplicate@example.com',
        'phone': '+1 555-1234',
        'password': 'password123',
        'role': 'provider'
    })
    res2 = client.post('/api/auth/register', json={
        'fullName': 'Copy User',
        'email': 'duplicate@example.com',
        'phone': '+1 555-9999',
        'password': 'password123',
        'role': 'ngo'
    })
    assert res2.status_code == 409

def test_login_and_logout(client):
    client.post('/api/auth/register', json={
        'fullName': 'Login Tester',
        'email': 'login_tester@example.com',
        'phone': '+1 555-2222',
        'password': 'secretpassword',
        'role': 'volunteer'
    })
    login_res = client.post('/api/auth/login', json={
        'email': 'login_tester@example.com',
        'password': 'secretpassword'
    })
    assert login_res.status_code == 200

    logout_res = client.post('/api/auth/logout')
    assert logout_res.status_code == 200
