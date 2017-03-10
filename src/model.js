import {URIValue, URIValueType} from 'rheactor-value-objects'
import {VersionNumberType, MaybeVersionNumberType} from './types'
import {Link, LinkListType, MaybeLinkListJSONType} from './link'
import {maybe, irreducible, String as StringType, struct, list} from 'tcomb'

export class Model {
  /**
   * @param {{$context: URIValue}} fields
   */
  constructor (fields) {
    this.$context = URIValueType(fields.$context, ['Model', '$context:URIValue'])
    this.$contextVersion = VersionNumberType(fields.$contextVersion || 1, ['Model', '$contextVersion:?VersionNumberType'])
    this.$links = LinkListType(fields.$links || [], ['Model', '$links:LinkList'])
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, $links: Array<Link>}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion
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
      $contextVersion: data.$contextVersion,
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

export const ModelType = irreducible('ModelType', Model.is)
export const ModelListType = list(ModelType)
export const MaybeModelType = maybe(ModelType)
export const ModelJSONType = struct({
  $context: StringType,
  $contextVersion: MaybeVersionNumberType,
  $links: MaybeLinkListJSONType
}, 'ModelJSONType')
export const MaybeModelJSONType = maybe(ModelJSONType)
