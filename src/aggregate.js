import {Entity} from './entity'
import {maybe, refinement, irreducible, Integer as IntegerType, String as StringType, Boolean as BooleanType, Date as DateType, struct} from 'tcomb'
export const VersionNumberType = refinement(IntegerType, n => n > 0, 'VersionNumberType')
const MaybeVersionNumberType = maybe(VersionNumberType)
const MaybeDateType = maybe(DateType)
const MaybeBooleanType = maybe(BooleanType)
const MaybeStringType = maybe(StringType)

export class Aggregate extends Entity {
  /**
   * @param {{$id: String, $version: Number, $context: URIValue, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    const {$version, $deleted, $createdAt} = fields
    DateType($createdAt)
    VersionNumberType($version)
    BooleanType($deleted || false)
    super(fields)
    this.$version = $version
    this.$deleted = !!$deleted
  }

  /**
   * @returns {{$id: String, $version: Number, $deleted: Boolean, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        $version: this.$version,
        $deleted: this.$deleted
      }
    )
  }

  /**
   * @param {{$id: String, $context: String, $deleted: Boolean, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    AggregateJSONType(data)
    return new Aggregate(Object.assign(
      super.fromJSON(data), {
        $version: data.$version,
        $deleted: data.$deleted
      })
    )
  }

  /**
   * @param {Number} updatedAt
   * @param {Number} newVersion
   */
  updated (updatedAt, newVersion) {
    MaybeDateType(updatedAt)
    MaybeVersionNumberType(newVersion)
    return this.constructor.fromJSON.call(undefined, Object.assign(
      this.toJSON(),
      {
        $version: newVersion || this.$version + 1,
        $updatedAt: updatedAt || new Date().toISOString()
      }
    ))
  }

  /**
   * @param {Number} deletedAt
   * @param {Number} newVersion
   */
  deleted (deletedAt, newVersion) {
    MaybeDateType(deletedAt)
    MaybeVersionNumberType(newVersion)
    return this.constructor.fromJSON.call(undefined, Object.assign(
      this.toJSON(),
      {
        $version: newVersion || this.$version + 1,
        $deleted: true,
        $deletedAt: deletedAt || new Date().toISOString()
      }
    ))
  }

  /**
   * Returns true if x is of type Aggregate
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Aggregate) || (Entity.is(x) && '$version' in x)
  }
}

export const AggregateJSONType = struct({
  $id: StringType,
  $version: VersionNumberType,
  $deleted: MaybeBooleanType,
  $createdAt: StringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType
}, 'AggregateJSONType')
export const AggregateType = irreducible('AggregateType', Aggregate.is)
