import {Entity} from './entity'
import {MaybeStringType, VersionNumberType, MaybeVersionNumberType, MaybeDateType} from './types'
import {maybe, irreducible, String as StringType, Date as DateType, struct} from 'tcomb'
import {MaybeLinkListJSONType} from './link'

/**
 * @deprecated Use ImmutableAggregate
 */
export class Aggregate extends Entity {
  /**
   * @param {{$id: URIValue, $version: Number, $context: URIValue, $createdAt: Date, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    DateType(fields.$createdAt, ['Aggregate', '$createdAt:Date']) // createdAt must not be undefined
    super(fields)
    this.$version = VersionNumberType(fields.$version, ['Aggregate', '$version:VersionNumber'])
  }

  /**
   * @returns {{$id: String, $version: Number, $context: String, $links: Array<Link>, $createdAt: String, $updatedAt: String|undefined, $deletedAt: String|undefined}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        $version: this.$version
      }
    )
  }

  /**
   * @param {{$id: String, $context: String, $links: Array<Link>, $createdAt: String, $updatedAt: String|undefined, $deletedAt: String|undefined}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    AggregateJSONType(data)
    return new Aggregate(Object.assign(
      super.fromJSON(data), {
        $version: data.$version
      })
    )
  }

  /**
   * @param {Number} updatedAt
   * @param {Number} newVersion
   */
  updated (updatedAt, newVersion) {
    MaybeDateType(updatedAt, ['Aggregate.updated', 'updatedAt:?Date'])
    MaybeVersionNumberType(newVersion, ['Aggregate.updated', 'newVersion:?VersionNumber'])
    return this.constructor.fromJSON.call(undefined, Object.assign(
      this.toJSON(),
      {
        $version: newVersion || this.$version + 1,
        $updatedAt: (updatedAt || new Date()).toISOString()
      }
    ))
  }

  /**
   * @param {Number} deletedAt
   * @param {Number} newVersion
   */
  deleted (deletedAt, newVersion) {
    MaybeDateType(deletedAt, ['Aggregate.deleted', 'deletedAt:?Date'])
    MaybeVersionNumberType(newVersion, ['Aggregate.updated', 'newVersion:?VersionNumber'])
    return this.constructor.fromJSON.call(undefined, Object.assign(
      this.toJSON(),
      {
        $version: newVersion || this.$version + 1,
        $deletedAt: (deletedAt || new Date()).toISOString()
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

export const AggregateType = irreducible('AggregateType', Aggregate.is)
export const MaybeAggregateType = maybe(AggregateType)
export const AggregateJSONType = struct({
  $context: StringType,
  $contextVersion: MaybeVersionNumberType,
  $id: StringType,
  $version: VersionNumberType,
  $createdAt: StringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType,
  $links: MaybeLinkListJSONType
}, 'AggregateJSONType')
export const MaybeAggregateJSONType = maybe(AggregateJSONType)
