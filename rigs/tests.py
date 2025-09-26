import json
import pytest
from django.contrib.auth.hashers import make_password
from rigs.models import User, Rig, Comment
from backend import schema as backend_schema


@pytest.fixture
def db_cleanup(setup_test_database):
    User.objects.all().delete()
    Rig.objects.all().delete()
    Comment.objects.all().delete()
    yield

@pytest.fixture
def sample_user(db_cleanup):
    user = User(username='testuser', email='test@example.com', password=make_password('pass123'))
    user.save()
    return user

@pytest.fixture
def sample_rig(db_cleanup, sample_user):
    rig = Rig(title='testrig', image_url='test.com', author=sample_user)
    rig.save()
    return rig

def test_all_rigs_query(client, sample_rig):
    query = '''
        query {
            allRigs {
                id
                title
            }
        }
    '''
    response = client.post('/graphql', data=json.dumps({'query': query}), content_type='application/json')
    assert response.status_code == 200
    content = json.loads(response.content)

    assert 'errors' not in content
    assert len(content['data']['allRigs']) == 1
    assert content['data']['allRigs'][0]['title'] == 'testrig'

def test_rig_by_id_query(client, sample_rig):
    query = '''
        query GetRigById($rigId: ID!) {
            rigById(id: $rigId) {
                id
                title
            }
        }
    '''
    variables = {'rigId': str(sample_rig.id)}
    response = client.post('/graphql', data=json.dumps({'query': query, 'variables': variables}), content_type='application/json')

    assert response.status_code == 200
    content = json.loads(response.content)

    assert 'errors' not in content
    assert content['data']['rigById']['title'] == 'testrig'

def test_create_rig_mutation(client, sample_user, monkeypatch):
    monkeypatch.setattr(backend_schema, 'get_user_from_context', lambda info: sample_user)

    mutation = '''
        mutation CreateRig($title: String!, $description: String, $imageUrl: String!) {
            createRig(title: $title, description: $description, imageUrl: $imageUrl) {
                rig {
                    id
                    title
                }
            }
        }
    '''
    variables = {'title': 'newtestrig', 'description': 'testdesc', 'imageUrl': 'newtest.com'}

    response = client.post('/graphql', data=json.dumps({'query': mutation, 'variables': variables}), content_type = 'application/json')\
    
    assert response.status_code == 200
    content = json.loads(response.content)

    assert 'errors' not in content
    assert content['data']['createRig']['rig']['title'] == 'newtestrig'