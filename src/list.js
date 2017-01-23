import {
  String as StringType,
  Integer as IntegerType,
  Function as FunctionType,
  irreducible,
  refinement,
  list,
  struct
} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
import {ModelType} from './model'
import {Link, LinkType, LinkJSONType} from './link'
const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#List')
const PositiveIntegerType = refinement(IntegerType, n => n > 0, 'PositiveIntegerType')
const ZeroOrPositiveIntegerType = refinement(IntegerType, n => n >= 0, 'ZeroOrPositiveIntegerType')
const ModelListType = list(ModelType)
const LinkListType = list(LinkType)

export class List {
  /**
   * @param {Array<Model>} items
   * @param {Number} total
   * @param {Number} itemsPerPage
   * @param {Array<Link>} links
   */
  constructor (items, total, itemsPerPage, links = []) {
    ModelListType(items)
    ZeroOrPositiveIntegerType(total)
    PositiveIntegerType(itemsPerPage)
    LinkListType(links)
    this.$context = $context
    this.$links = links
    this.items = items
    this.total = total
    this.itemsPerPage = itemsPerPage
    this.hasNext = this.$links.filter(link => link.rel === 'next').length > 0
    this.hasPrev = this.$links.filter(link => link.rel === 'prev').length > 0
  }

  /**
   * @returns {{$context: String, $links: Array<Link>, items: Array<Link>, total: Number, itemsPerPage: Number, hasNext: Boolean, hasPrev: Boolean}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      items: this.items.map(item => item.toJSON()),
      total: this.total,
      itemsPerPage: this.itemsPerPage,
      hasNext: this.hasNext,
      hasPrev: this.hasPrev,
      $links: []
    }
    if (this.$links.length) d.$links = this.$links.map(link => link.toJSON())
    return d
  }

  /**
   * @param {{$context: String, $links: Array<Link>, items: Array<Link>, total: Number, itemsPerPage: Number, hasNext: Boolean, hasPrev: Boolean}} data
   * @param {function} transformer item transformer
   * @returns {List}
   */
  static fromJSON (data, transformer) {
    ListJSONType(data)
    FunctionType(transformer)
    return new List(
      data.items.map(transformer),
      data.total,
      data.itemsPerPage,
      data.$links ? data.$links.map(Link.fromJSON) : []
    )
  }

  /**
   * @returns {URIValue}
   */
  static get $context () {
    return $context
  }

  /**
   * Returns true if x is of type List
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof List) || (x && x.constructor && x.constructor.name === List.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const ListJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'ListContext'),
  $links: list(LinkJSONType),
  total: ZeroOrPositiveIntegerType,
  itemsPerPage: PositiveIntegerType
}, 'ListJSONType')
export const ListType = irreducible('ListType', List.is)
