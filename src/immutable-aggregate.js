import {Entity} from './entity'
import {String as StringType, Date as DateType, Any as AnyType, dict, maybe, irreducible, struct} from 'tcomb'
import {MaybeStringType, VersionNumberType, MaybeVersionNumberType} from './types'
import {MaybeLinkListJSONType} from './link'
const PropsType = dict(StringType, AnyType)

export class ImmutableAggregate extends Entity {
  /**
   * @param {{$id: URIValue, $version: Number, $context: URIValue, $createdAt: Date, $updatedAt: Date|undefined, $deletedAt: Date|undefined}} fields
   */
  constructor (fields) {
    super(fields)
    DateType(fields.$createdAt, ['ImmutableAggregate', '$createdAt:Date']) // $createdAt must be defined
    this.$version = VersionNumberType(fields.$version, ['ImmutableAggregate', '$version:VersionNumber'])
  }

  /**
   * Returns an updated, new instance of this Aggregate,
   * with the version increased by one and the updated date
   * set to now using newProps to set the updated properties.
   * The values in newProps should be in the format expected
   * by fromJSON() for this Aggregate.
   *
   * @param {Object} newProps
   * @returns {Entity}
   */
  updated (newProps) {
    PropsType(newProps, ['ImmutableAggregate', 'updated()', 'newProps:Map<String: *>'])
    return this.constructor.fromJSON.call(undefined, Object.assign(this.toJSON(), {$version: this.$version + 1, $updatedAt: new Date().toISOString()}, newProps))
  }

  /**
   * Returns an updated, new instance of this Aggregate,
   * with the version increased by one and the deleted date
   * set to now.
   *
   * @returns {Entity}
   */
  deleted () {
    return this.constructor.fromJSON.call(undefined, Object.assign(this.toJSON(), {$version: this.$version + 1, $deletedAt: new Date().toISOString()}))
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
    ImmutableAggregateJSONType(data)
    return new ImmutableAggregate(Object.assign(
      super.fromJSON(data), {
        $version: data.$version
      })
    )
  }

  /**
   * Returns true if x is of type ImmutableAggregate
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof ImmutableAggregate) || (Entity.is(x) && '$version' in x)
  }
}

export const ImmutableAggregateType = irreducible('ImmutableAggregateType', ImmutableAggregate.is)
export const MaybeImmutableAggregateType = maybe(ImmutableAggregateType)
export const ImmutableAggregateJSONType = struct({
  $context: StringType,
  $contextVersion: MaybeVersionNumberType,
  $id: StringType,
  $version: VersionNumberType,
  $createdAt: StringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType,
  $links: MaybeLinkListJSONType
}, 'ImmutableAggregateJSONType')
export const MaybeImmutableAggregateJSONType = maybe(ImmutableAggregateJSONType)
