import {URIValue, URIValueType} from 'rheactor-value-objects'
import {MaybeVersionNumberType} from './types'
import {EntityType} from './entity'
import {maybe, refinement, irreducible, String as StringType, struct} from 'tcomb'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Reference')
const $contextVersion = 1

export class Reference {
  /**
   * @param {URIValue} $id The id of the referenced item, which is also the URL to retrieve the reference
   * @param {URIValue} subject The context of the referenced item
   */
  constructor ($id, subject) {
    this.$context = $context
    this.$contextVersion = $contextVersion
    this.$id = URIValueType($id, ['Reference', '$id:URIValue'])
    this.subject = URIValueType(subject, ['Reference', 'subject:URIValue'])
  }

  /**
   * @param {Entity} entity
   * @returns {Reference}
   */
  static fromEntity (entity) {
    EntityType(entity, ['Reference', 'fromEntity()', 'entity:Entity'])
    return new Reference(entity.$id, entity.$context)
  }

  /**
   * @returns {{$context: String, subject: String, $id: String}}}
   */
  toJSON () {
    return {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      subject: this.subject.toString(),
      $id: this.$id.toString()
    }
  }

  /**
   * @param {{$context: String, subject: String, $id: String}} data
   * @returns {Reference}
   */
  static fromJSON (data) {
    ReferenceJSONType(data)
    const {$id, subject} = data
    return new Reference(new URIValue($id), new URIValue(subject))
  }

  /**
   * @returns {URIValue}
   */
  static get $context () {
    return $context
  }

  /**
   * @returns {Number}
   */
  static get $contextVersion () {
    return $contextVersion
  }

  /**
   * Returns true if x is of type Reference
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Reference) || (x && x.constructor && x.constructor.name === Reference.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const ReferenceType = irreducible('ReferenceType', Reference.is)
export const MaybeReferenceType = maybe(ReferenceType)
export const ReferenceJSONType = struct({
  $context: refinement(StringType, s => s === Reference.$context.toString(), 'ReferenceContext'),
  $contextVersion: MaybeVersionNumberType,
  subject: StringType,
  $id: StringType
}, 'ReferenceJSONType')
export const MaybeReferenceJSONType = maybe(ReferenceJSONType)
