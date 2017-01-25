import {String as StringType, irreducible, struct, refinement} from 'tcomb'
import {URIValue, URIValueType} from 'rheactor-value-objects'
const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Reference')

export class Reference {
  /**
   * @param {URIValue} $id The id of the referenced item, which is also the URL to retrieve the reference
   * @param {URIValue} subject The context of the referenced item
   */
  constructor ($id, subject) {
    URIValueType($id, ['Reference', '$id:URIValue'])
    URIValueType(subject, ['Reference', 'subject:URIValue'])
    this.$context = $context
    this.$id = $id
    this.subject = subject
  }

  /**
   * @returns {{$context: String, subject: String, $id: String}}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      subject: this.subject.toString(),
      $id: this.$id.toString()
    }
    return d
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
   * Returns true if x is of type Reference
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Reference) || (x && x.constructor && x.constructor.name === Reference.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const ReferenceJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'ReferenceContext'),
  subject: StringType,
  $id: StringType
}, 'ReferenceJSONType')
export const ReferenceType = irreducible('ReferenceType', Reference.is)
