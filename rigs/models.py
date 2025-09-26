import mongoengine
from datetime import datetime

class User(mongoengine.Document):
    username = mongoengine.StringField(required=True, unique=True)
    email = mongoengine.StringField(required=True, unique=True)
    password = mongoengine.StringField(required=True)
    is_active = mongoengine.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    @property
    def pk(self):
        return str(self.id)

    def get_username(self):
        return self.username

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username
    
    def get_short_name(self):
        return self.username

    def natural_key(self):
        return (self.username,)

    meta = {'collection': 'users'}

class Rig(mongoengine.Document):
    title = mongoengine.StringField(required=True, max_length=200)
    image_url = mongoengine.StringField(required=True)
    description = mongoengine.StringField(max_length=500)
    author = mongoengine.ReferenceField(User, required=True)
    rating = mongoengine.ListField(mongoengine.IntField(min_value=1, max_value=5))
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'rigs'}

class Comment(mongoengine.Document):
    text = mongoengine.StringField(required=True)
    author = mongoengine.ReferenceField(User, required=True)
    rig = mongoengine.ReferenceField(Rig, required=True)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'comments'}