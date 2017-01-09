import {URIValue, URIValueType} from 'rheactor-value-objects'
import {irreducible, String as StringType, struct, maybe, list} from 'tcomb'
import {Link, LinkJSONType} from './link'
const LinkListType = list(Link)

export class Model {
  /**
   * @param {{$context: URIValue}} fields
   */
  constructor (fields) {
    const {$context, $links} = fields
    URIValueType($context)
    LinkListType($links || [])
    this.$context = $context
    this.$links = $links || []
  }

  /**
   * @returns {{$context: String, $links: Array<Link>}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString()
    }
    if (this.$links.length) d.$links = this.$links.map(link => link.toJSON())
    return d
  }

  /**
   * @param {{$context: String}} data
   * @returns {Model}
   */
  static fromJSON (data) {
    ModelJSONType(data)
    return new Model({
      $context: new URIValue(data.$context),
      $links: data.$links ? data.$links.map(l => Link.fromJSON(l)) : []
    })
  }

  /**
   * Returns true if x is of type Model
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Model) || (x && '$context' in x && '$links' in x)
  }
}

export const ModelJSONType = struct({
  $context: StringType,
  $links: maybe(list(LinkJSONType))
}, 'ModelJSONType')
export const ModelType = irreducible('ModelTypeType', Model.is)
