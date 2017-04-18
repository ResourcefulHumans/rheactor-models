import {URIValue} from 'rheactor-value-objects'
import {Model} from './model'
import {String as StringType, maybe, refinement, irreducible, struct} from 'tcomb'
import {MaybeVersionNumberType} from './types'
import {Link, MaybeLinkListJSONType} from './link'

let atobImpl

if (typeof atob === 'undefined') {
  if (typeof Buffer !== 'undefined') {
    atobImpl = (str) => Buffer.from(str, 'base64').toString('binary')
  } else {
    atobImpl = require('base-64').decode
  }
} else {
  /* globals atob */
  atobImpl = atob
}

const $context = new URIValue('https://tools.ietf.org/html/rfc7519')
const $contextVersion = 2

export class JsonWebToken extends Model {
  /**
   * @param {String} token
   * @param {Array.<Link>} $links
   */
  constructor (token, $links) {
    super({$context, $contextVersion, $links})
    StringType(token)
    const data = JSON.parse(atobImpl(token.split('.')[1]))
    this.iss = undefined // Issuer
    this.sub = undefined // Subject
    this.aud = undefined // Audience
    this.exp = undefined // Expiration Time
    this.nbf = undefined // Not Before
    this.iat = undefined // Issued At
    this.jti = undefined // JWT ID
    const self = this
    const props = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti']
    props.map(k => {
      self[k] = data[k] || undefined
      delete data[k]
    })
    if (this.exp) {
      this.exp = new Date(this.exp * 1000)
    }
    if (this.nbf) {
      this.nbf = new Date(this.nbf * 1000)
    }
    if (this.iat) {
      this.iat = new Date(this.iat * 1000)
    }
    // Store remaining data
    this.payload = data
    this.token = token
  }

  /**
   * @returns {{$context: String, $contextVersion: Number, $links: Array<Link>, token: String}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        token: this.token
      }
    )
  }

  /**
   * @param {{$context: String, $links: Array<Link>, token: String}} data
   * @returns {JsonWebToken}
   */
  static fromJSON (data) {
    JsonWebTokenJSONType(data)
    return new JsonWebToken(data.token, data.$links ? data.$links.map(Link.fromJSON) : [])
  }

  /**
   * @returns {Boolean}
   */
  isExpired () {
    return this.exp.getTime() < Date.now()
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
   * Returns true if x is of type JsonWebToken
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof JsonWebToken) || (x && x.constructor && x.constructor.name === JsonWebToken.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const JsonWebTokenType = irreducible('JsonWebTokenType', JsonWebToken.is)
export const JsonWebTokenJSONType = struct({
  $context: refinement(StringType, s => s === JsonWebToken.$context.toString(), 'JsonWebTokenContext'),
  $contextVersion: MaybeVersionNumberType,
  token: StringType,
  $links: MaybeLinkListJSONType
}, 'JsonWebTokenJSONType')
export const MaybeJsonWebTokenType = maybe(JsonWebTokenType)
export const MaybeJsonWebTokenJSONType = maybe(JsonWebTokenJSONType)
