import mongoengine
from datetime import datetime

# Create your models here.

class User(mongoengine.Document):
    username = mongoengine.StringField(required=True, unique=True)
    email = mongoengine.StringField(required=True, unique=True)
    password = mongoengine.StringField(required=True)

    meta = {'collection': 'users'}

class Comment(mongoengine.Document):
    text = mongoengine.StringField(required=True, unique=True)
    author = mongoengine.ReferenceField(User, required=True)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'comments'}

class Rig(mongoengine.Document):
    title = mongoengine.StringField(required=True, max_length=200)
    image_url = mongoengine.StringField(required=True)
    description = mongoengine.StringField(max_length=500)
    author = mongoengine.ReferenceField(User, required=True)
    comments = mongoengine.ListField(mongoengine.ReferenceField(Comment))
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'rigs'}