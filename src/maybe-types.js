import {maybe} from 'tcomb'
import {AggregateType} from './aggregate'
import {IndexType} from './apiindex'
import {EntityType} from './entity'
import {HttpProblemType} from './http-problem'
import {JsonWebTokenType} from './jsonwebtoken'
import {LinkType} from './link'
import {ListType} from './list'
import {ModelType} from './model'
import {ReferenceType} from './reference'
import {StatusType} from './status'
import {UserType} from './user'

export const MaybeAggregateType = maybe(AggregateType)
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
