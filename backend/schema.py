import graphene
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

    def mutate(root, info, title, description, image_url):
        author = UserModel.objects.first()
        rig = RigModel(title=title, description=description, image_url=image_url, author=author)
        rig.save()

        return CreateRig(rig=rig)

class Mutation(graphene.ObjectType):
    create_rig = CreateRig.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)