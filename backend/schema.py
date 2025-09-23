import graphene
from graphene_mongo import MongoengineObjectType
from rigs.models import Rig as RigModel

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

schema = graphene.Schema(query=Query)