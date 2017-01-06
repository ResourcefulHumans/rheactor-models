import {String as StringType, Boolean as BooleanType, irreducible, maybe, struct, refinement} from 'tcomb'
import {URIValue, URIValueType} from 'rheactor-value-objects'
const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Link')

export class Link {
  /**
   * @param {URIValue} href The URL to retrieve the link
   * @param {URIValue} subject The context of the linked item
   * @param {Boolean} list True if the linked item is a list
   * @param {String} rel Label for the relation
   */
  constructor (href, subject, list = false, rel) {
    URIValueType(href)
    URIValueType(subject)
    BooleanType(list)
    maybe(StringType)(rel)
    this.$context = $context
    this.href = href
    this.subject = subject
    this.list = list
    this.rel = rel
  }

  /**
   * @returns {{$context: String, subject: String, href: String, list: Boolean|undefined, rel: String|undefined}}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
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
}

export const LinkJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'LinkContext'),
  subject: StringType,
  href: StringType,
  list: maybe(BooleanType),
  rel: maybe(StringType)
}, 'LinkJSONType')
export const LinkType = irreducible('LinkType', x => (x instanceof Link) || (x && x.constructor && x.constructor.name === Link.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context)))
