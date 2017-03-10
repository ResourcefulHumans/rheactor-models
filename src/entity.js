import {URIValue, URIValueType} from 'rheactor-value-objects'
import {irreducible, maybe, Date as DateType, String as StringType, struct} from 'tcomb'
import {Model} from './model'
import {MaybeLinkListJSONType} from './link'
const MaybeDateType = maybe(DateType)

export class Entity extends Model {
  /**
   * @param {{$id: URIValue, $context: URIValue, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    super(fields)
    this.$id = URIValueType(fields.$id, ['Entity', '$id:URIValue'])
    this.$createdAt = MaybeDateType(fields.$createdAt, ['Entity', '$createdAt:?Date'])
    this.$updatedAt = MaybeDateType(fields.$updatedAt, ['Entity', '$updatedAt:?Date'])
    this.$deletedAt = MaybeDateType(fields.$deletedAt, ['Entity', '$deletedAt:?Date'])
  }

  /**
   * Whether this Aggregate has been deleted
   *
   * @returns {boolean}
   */
  get $deleted () {
    return this.$deletedAt !== undefined
  }

  /**
   * @returns {{$id: String, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        $id: this.$id.toString(),
        $createdAt: this.$createdAt ? this.$createdAt.toISOString() : undefined,
        $updatedAt: this.$updatedAt ? this.$updatedAt.toISOString() : undefined,
        $deletedAt: this.$deletedAt ? this.$deletedAt.toISOString() : undefined
      }
    )
  }

  /**
   * @param {{$id: String, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    EntityJSONType(data)
    return new Entity(Object.assign(
      super.fromJSON(data), {
        $id: new URIValue(data.$id),
        $context: new URIValue(data.$context),
        $createdAt: data.$createdAt ? new Date(data.$createdAt) : undefined,
        $updatedAt: data.$updatedAt ? new Date(data.$updatedAt) : undefined,
        $deletedAt: data.$deletedAt ? new Date(data.$deletedAt) : undefined
      })
    )
  }

  /**
   * Returns the timestamp when the model was modified the last time, which is the latest value of
   * createdAt, updatedAt or deletedAt
   *
   * @returns {Date|undefined}
   */
  get $modifiedAt () {
    if (this.$deletedAt) {
      return this.$deletedAt
    }
    if (this.$updatedAt) {
      return this.$updatedAt
    }
    return this.$createdAt
  }

  /**
   * Returns true if x is of type Entity
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Entity) || (Model.is(x) && '$id' in x && '$createdAt' in x && '$updatedAt' in x && '$deletedAt' in x)
  }
}

export const EntityJSONType = struct({
  $context: StringType,
  $id: StringType,
  $createdAt: maybe(StringType),
  $updatedAt: maybe(StringType),
  $deletedAt: maybe(StringType),
  $links: MaybeLinkListJSONType
}, 'EntityJSONType')
export const EntityType = irreducible('EntityType', Entity.is)
