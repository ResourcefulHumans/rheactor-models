import {URIValue, URIValueType} from 'rheactor-value-objects'
import {irreducible, String as StringType, struct} from 'tcomb'
import {Link, LinkListType, MaybeLinkListJSONType} from './link'

export class Model {
  /**
   * @param {{$context: URIValue}} fields
   */
  constructor (fields) {
    this.$context = URIValueType(fields.$context, ['Model', '$context:URIValue'])
    this.$links = LinkListType(fields.$links || [], ['Model', '$links:LinkList'])
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
  $links: MaybeLinkListJSONType
}, 'ModelJSONType')
export const ModelType = irreducible('ModelType', Model.is)
