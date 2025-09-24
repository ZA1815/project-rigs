from django.contrib.auth.hashers import check_password
from rigs.models import User as UserModel
from bson import ObjectId
from bson.errors import InvalidId

class MongoEngineBackend:
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = UserModel.objects.get(username=username)
            if check_password(password, user.password):
                return user
            else:
                return None
        except UserModel.DoesNotExist:
            return None
        
    def get_user(self, user_id):
        try:
            if isinstance(user_id, str):
                try:
                    user_id = ObjectId(user_id)
                except InvalidId:
                    return None
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None