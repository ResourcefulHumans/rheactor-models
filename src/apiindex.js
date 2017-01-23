import {String as StringType, irreducible, refinement, list, struct} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
import {Link, LinkType, LinkJSONType} from './link'
const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Index')
const LinkIndexType = list(LinkType)

export class Index {
  /**
   * @param {Array<Link>} links
   */
  constructor (links) {
    LinkIndexType(links)
    this.$context = $context
    this.$links = links
  }

  /**
   * @returns {{$context: String, $links: Array<Link>}}
   */
  toJSON () {
    return {
      $context: this.$context.toString(),
      $links: this.$links.map(link => link.toJSON())
    }
  }

  /**
   * @param {{$context: String, $links: Array<Link>}} data
   * @returns {Index}
   */
  static fromJSON (data) {
    IndexJSONType(data)
    return new Index(data.$links.map(Link.fromJSON))
  }

  /**
   * @returns {URIValue}
   */
  static get $context () {
    return $context
  }

  /**
   * Returns true if x is of type Index
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Index) || (x && x.constructor && x.constructor.name === Index.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const IndexJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'IndexContext'),
  $links: list(LinkJSONType)
}, 'IndexJSONType')
export const IndexType = irreducible('IndexType', Index.is)
