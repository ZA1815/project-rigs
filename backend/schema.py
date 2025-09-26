import graphene
import graphql_jwt
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from graphene_mongo import MongoengineObjectType
from rigs.models import Rig as RigModel, User as UserModel, Comment as CommentModel
from django.contrib.auth.hashers import make_password

def get_user_from_context(info):
    request = info.context
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    if not auth_header.startswith('JWT '):
        return None

    token = auth_header[4:]
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        username = payload.get('username')
        if username:
            return UserModel.objects.get(username=username)

    except (jwt.InvalidTokenError, UserModel.DoesNotExist):
        return None
    return None

class RigType(MongoengineObjectType):
    class Meta:
        model = RigModel
        exclude_fields = ('rating')

    rating = graphene.List(graphene.Int)
    average_rating = graphene.Float()

    def resolve_rating(self, info):
        return self.rating
    
    def resolve_average_rating(self, info):
        if not self.rating:
            return 0
        average = sum(self.rating) / len(self.rating)
        return round(average, 1)
    
    comments = graphene.List(lambda: CommentType)

    def resolve_comments(self, info):
        return CommentModel.objects.filter(rig=self)

class UserType(MongoengineObjectType):
    class Meta:
        model = UserModel
        exclude_fields = ('password',)

class CommentType(MongoengineObjectType):
    class Meta:
        model = CommentModel

class Query(graphene.ObjectType):
    all_rigs = graphene.List(RigType)
    rig_by_id = graphene.Field(RigType, id=graphene.ID(required=True))

    def resolve_all_rigs(root, info):
        return RigModel.objects.all().order_by('-created_at')
    
    def resolve_rig_by_id(root, info, id):
        return RigModel.objects.get(id=id)

class CreateRig(graphene.Mutation):
    rig = graphene.Field(RigType)

    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        image_url = graphene.String(required=True)
    
    @classmethod
    def mutate(cls, root, info, title, description, image_url):
        user = get_user_from_context(info)
        
        if not user:
            raise Exception("Authentication required. Please provide a valid token.")

        rig = RigModel(title=title, description=description, image_url=image_url, author=user)
        rig.save()
        return CreateRig(rig=rig)

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
    
    @classmethod
    def mutate(cls, root, info, username, email, password):
        hashed_password = make_password(password)
        user = UserModel(username=username, email=email, password=hashed_password)
        user.save()

        payload = {
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(days=7)
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return CreateUser(user=user, token=token)

class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        text = graphene.String(required=True)
        rig_id = graphene.ID(required=True)
    
    @classmethod
    def mutate(cls, root, info, text, rig_id):
        user = get_user_from_context(info)

        if not user:
            raise Exception('Authentication required. Please provide a valid token.')

        try: 
            rig = RigModel.objects.get(id=rig_id)
        except RigModel.DoesNotExist:
            raise Exception ('Rig not found.')
        
        comment = CommentModel(text=text, author=user, rig=rig)
        comment.save()

        return CreateComment(comment=comment)

class SubmitRating(graphene.Mutation):
    rig = graphene.Field(RigType)

    class Arguments:
        rig_id = graphene.ID(required=True)
        rating = graphene.Int(required=True)

    @classmethod
    def mutate(cls, root, info, rig_id, rating):
        user = get_user_from_context(info)

        if not user:
            raise Exception('Authentication required. Please provide a valid token.')
        
        try:
            rig = RigModel.objects.get(id=rig_id)
        except RigModel.DoesNotExist:
            raise Exception('Rig not found.')

        if rating < 1 or rating > 5:
            raise Exception('Rating must be between 1 and 5.')
        
        if rig.rating is None:
            rig.rating = []
        
        rig.rating.append(rating)
        rig.save()

        return SubmitRating(rig=rig)



class Mutation(graphene.ObjectType):
    create_rig = CreateRig.Field()
    create_comment = CreateComment.Field()
    create_user = CreateUser.Field()
    submit_rating = SubmitRating.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)