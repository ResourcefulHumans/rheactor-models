import {Boolean as BooleanType, maybe, refinement, irreducible, String as StringType, struct, list} from 'tcomb'
import {URIValue, URIValueType} from 'rheactor-value-objects'
import {MaybeStringType, MaybeVersionNumberType} from './types'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Link')
const $contextVersion = 1

export class Link {
  /**
   * @param {URIValue} href The URL to retrieve the link
   * @param {URIValue} subject The context of the linked item
   * @param {Boolean} list True if the linked item is a list
   * @param {String} rel Label for the relation
   */
  constructor (href, subject, list = false, rel) {
    this.href = URIValueType(href, ['Link', 'href:URIValue'])
    this.subject = URIValueType(subject, ['Link', 'subject:URIValue'])
    this.list = BooleanType(list, ['Link', 'list:Boolean'])
    this.rel = MaybeStringType(rel, ['Link', 'rel:?String'])
    this.$context = $context
    this.$contextVersion = $contextVersion
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, subject: String, href: String, list: Boolean|undefined, rel: String|undefined}}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      subject: this.subject.toString(),
      href: this.href.toString()
    }
    if (this.list) d.list = true
    if (this.rel) d.rel = this.rel
    return d
  }

  /**
   * @param {{$context: String, subject: String, href: String, list: Boolean|undefined, rel: String|undefined}} data
   * @returns {Link}
   */
  static fromJSON (data) {
    LinkJSONType(data)
    const {href, subject, list, rel} = data
    return new Link(new URIValue(href), new URIValue(subject), list, rel)
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
   * Returns true if x is of type Link
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Link) || (x && x.constructor && x.constructor.name === Link.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const LinkType = irreducible('LinkType', Link.is)
export const MaybeLinkType = maybe(LinkType)
export const LinkListType = list(LinkType)
export const MaybeLinkListType = maybe(LinkListType)
export const LinkJSONType = struct({
  $context: refinement(StringType, s => s === Link.$context.toString(), 'LinkContext'),
  $contextVersion: MaybeVersionNumberType,
  subject: StringType,
  href: StringType,
  list: maybe(BooleanType),
  rel: maybe(StringType)
}, 'LinkJSONType')
export const MaybeLinkJSONType = maybe(LinkJSONType)
export const LinkListJSONType = list(LinkJSONType)
export const MaybeLinkListJSONType = maybe(LinkListJSONType)
