import {maybe} from 'tcomb'
import {AggregateType, AggregateJSONType} from './aggregate'
import {ImmutableAggregateType, ImmutableAggregateJSONType} from './immutable-aggregate'
import {IndexType} from './apiindex'
import {EntityType, EntityJSONType} from './entity'
import {HttpProblemType} from './http-problem'
import {JsonWebTokenType, JsonWebTokenJSONType} from './jsonwebtoken'
import {LinkType, LinkJSONType} from './link'
import {ListType, ListJSONType} from './list'
import {ModelType, ModelJSONType} from './model'
import {ReferenceType, ReferenceJSONType} from './reference'
import {StatusType} from './status'
import {UserType, UserJSONType} from './user'

export const MaybeAggregateType = maybe(AggregateType)
export const MaybeImmutableAggregateType = maybe(ImmutableAggregateType)
export const MaybeIndexType = maybe(IndexType)
export const MaybeEntityType = maybe(EntityType)
export const MaybeHttpProblemType = maybe(HttpProblemType)
export const MaybeJsonWebTokenType = maybe(JsonWebTokenType)
export const MaybeLinkType = maybe(LinkType)
export const MaybeListType = maybe(ListType)
export const MaybeModelType = maybe(ModelType)
export const MaybeReferenceType = maybe(ReferenceType)
export const MaybeStatusType = maybe(StatusType)
export const MaybeUserType = maybe(UserType)

export const MaybeModelJSONType = maybe(ModelJSONType)
export const MaybeAggregateJSONType = maybe(AggregateJSONType)
export const MaybeImmutableAggregateJSONType = maybe(ImmutableAggregateJSONType)
export const MaybeListJSONType = maybe(ListJSONType)
export const MaybeReferenceJSONType = maybe(ReferenceJSONType)
export const MaybeUserJSONType = maybe(UserJSONType)
export const MaybeEntityJSONType = maybe(EntityJSONType)
export const MaybeJsonWebTokenJSONType = maybe(JsonWebTokenJSONType)
export const MaybeLinkJSONType = maybe(LinkJSONType)
