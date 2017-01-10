import {URIValue} from 'rheactor-value-objects'
import {irreducible, maybe, Date as DateType, String as StringType, struct} from 'tcomb'
import {Model} from './model'
const MaybeDateType = maybe(DateType)

export class Entity extends Model {
  /**
   * @param {{$id: String, $context: URIValue, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    const {$id, $createdAt, $updatedAt, $deletedAt} = fields
    super(fields)
    StringType($id)
    MaybeDateType($createdAt)
    MaybeDateType($updatedAt)
    MaybeDateType($deletedAt)
    this.$id = $id
    this.$createdAt = $createdAt
    this.$updatedAt = $updatedAt
    this.$deletedAt = $deletedAt
  }

  /**
   * @returns {{$id: String, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        $id: this.$id,
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
        $id: data.$id,
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
  $id: StringType,
  $createdAt: maybe(StringType),
  $updatedAt: maybe(StringType),
  $deletedAt: maybe(StringType)
}, 'EntityJSONType')
export const EntityType = irreducible('EntityType', Entity.is)
