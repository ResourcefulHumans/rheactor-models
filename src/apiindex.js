import {list, maybe, refinement, irreducible, String as StringType, struct} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
import {Link, LinkType, LinkListJSONType} from './link'
import {MaybeVersionNumberType} from './types'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Index')
const $contextVersion = 1

export class Index {
  /**
   * @param {Array<Link>} links
   */
  constructor (links) {
    this.$context = $context
    this.$contextVersion = $contextVersion
    this.$links = LinkIndexType(links)
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, $links: Array<Link>}}
   */
  toJSON () {
    return {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
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
   * @returns {Number}
   */
  static get $contextVersion () {
    return $contextVersion
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

export const IndexType = irreducible('IndexType', Index.is)
export const LinkIndexType = list(LinkType)
export const MaybeIndexType = maybe(IndexType)
export const IndexJSONType = struct({
  $context: refinement(StringType, s => s === Index.$context.toString(), 'IndexContext'),
  $contextVersion: MaybeVersionNumberType,
  $links: LinkListJSONType
}, 'IndexJSONType')
