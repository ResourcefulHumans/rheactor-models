import {Function as FunctionType, maybe, refinement, Integer as IntegerType, irreducible, String as StringType, struct, list} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
import {Link, LinkListType, LinkJSONType} from './link'
import {ModelListType} from './model'
import {MaybeVersionNumberType} from './types'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#List')
const $contextVersion = 1

export class List {
  /**
   * @param {Array<Model>} items
   * @param {Number} total
   * @param {Number} itemsPerPage
   * @param {Array<Link>} links
   * @param {Number} offset (optional)
   */
  constructor (items, total, itemsPerPage, links = [], offset) {
    this.$context = $context
    this.$contextVersion = $contextVersion
    this.$links = LinkListType(links, ['List', 'links:LinkList'])
    this.items = ModelListType(items, ['List', 'items:?ModelList'])
    this.total = ZeroOrPositiveIntegerType(total, ['List', 'total:Integer >= 0'])
    this.itemsPerPage = PositiveIntegerType(itemsPerPage, ['List', 'itemsPerPage:Integer > 0'])
    this.hasNext = this.$links.filter(link => link.rel === 'next').length > 0
    this.hasPrev = this.$links.filter(link => link.rel === 'prev').length > 0
    this.offset = MaybeZeroOrPositiveIntegerType(offset, ['List', 'offset:?Integer >= 0'])
  }

  /**
   * @return {Number|undefined}
   */
  get from () {
    if (typeof this.offset === 'undefined') return
    return this.total > 0 ? this.offset + 1 : 0
  }

  /**
   * @return {Number|undefined}
   */
  get to () {
    if (typeof this.offset === 'undefined') return
    return Math.min(this.offset + this.itemsPerPage, this.total)
  }

  /**
   * @returns {{$context: String, $links: Array<Link>, items: Array<Link>, total: Number, itemsPerPage: Number, hasNext: Boolean, hasPrev: Boolean, offset: Number|undefined}}
   */
  toJSON () {
    const d = {
      $context: this.$context.toString(),
      $contextVersion: this.$contextVersion,
      items: this.items.map(item => item.toJSON()),
      total: this.total,
      itemsPerPage: this.itemsPerPage,
      hasNext: this.hasNext,
      hasPrev: this.hasPrev,
      $links: [],
      offset: this.offset
    }
    if (this.$links.length) d.$links = this.$links.map(link => link.toJSON())
    return d
  }

  /**
   * @param {{$context: String, $links: Array<Link>, items: Array<Link>, total: Number, itemsPerPage: Number, hasNext: Boolean, hasPrev: Boolean, offset: Number|undefined}} data
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
      data.$links ? data.$links.map(Link.fromJSON) : [],
      data.offset
    )
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
   * Returns true if x is of type List
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof List) || (x && x.constructor && x.constructor.name === List.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const PositiveIntegerType = refinement(IntegerType, n => n > 0, 'PositiveIntegerType')
export const ZeroOrPositiveIntegerType = refinement(IntegerType, n => n >= 0, 'ZeroOrPositiveIntegerType')
export const MaybeZeroOrPositiveIntegerType = maybe(ZeroOrPositiveIntegerType)

export const ListType = irreducible('ListType', List.is)
export const MaybeListType = maybe(ListType)
export const ListJSONType = struct({
  $context: refinement(StringType, s => s === List.$context.toString(), 'ListContext'),
  $contextVersion: MaybeVersionNumberType,
  $links: list(LinkJSONType),
  total: ZeroOrPositiveIntegerType,
  itemsPerPage: PositiveIntegerType
}, 'ListJSONType')
export const MaybeListJSONType = maybe(ListJSONType)
