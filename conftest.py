import pytest
import mongoengine
from django.conf import settings
from django.test import Client

@pytest.fixture(scope='session', autouse=True)
def setup_test_database():
    mongoengine.disconnect_all()

    test_db_name = 'test_project_rigs_db'

    mongoengine.connect(test_db_name, host=settings.MONGODB_SETTINGS['host'])
    print(f'\n--- CONNECTED TO TEST DATABASE: {test_db_name} ---')

    yield

    print(f'\n--- DROPPING TEST DATABASE: {test_db_name} ---')
    try:
        db = mongoengine.get_db()
        db.client.drop_database(test_db_name)
    except Exception as e:
        print(f'Could not drop test database: {e}')
    finally:
        mongoengine.disconnect_all()

@pytest.fixture(scope='function')
def client():
    return Client()