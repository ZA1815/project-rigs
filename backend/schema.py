import graphene
import graphql_jwt
from graphene_mongo import MongoengineObjectType
from rigs.models import Rig as RigModel, User as UserModel

class RigType(MongoengineObjectType):
    class Meta:
        model = RigModel

class Query(graphene.ObjectType):
    all_rigs = graphene.List(RigType)

    rig_by_id = graphene.Field(RigType, id=graphene.ID(required=True))

    def resolve_all_rigs(root, info):
        return RigModel.objects.all()
    
    def resolve_rig_by_id(root, info, id):
        return RigModel.objects.get(id=id)

class CreateRig(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        image_url = graphene.String(required=True)
    
    rig = graphene.Field(RigType)

    @classmethod
    def mutate(cls, root, info, title, description, image_url):
        if not info.context.user.is_authenticated:
            raise Exception("Authentication credentials were not provided")

        author = info.context.user

        rig = RigModel(title=title, description=description, image_url=image_url, author=author)
        rig.save()

        return CreateRig(rig=rig)

class Mutation(graphene.ObjectType):
    create_rig = CreateRig.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)