import {Aggregate} from './aggregate'
import {MaybeStringType, VersionNumberType, MaybeVersionNumberType, MaybeBooleanType} from './types'
import {MaybeLinkListJSONType} from './link'
import {EmailValue, EmailValueType, URIValue, MaybeURIValueType} from 'rheactor-value-objects'
import {String as StringType, Any as AnyType, Boolean as BooleanType, dict, maybe, refinement, irreducible, struct} from 'tcomb'
const PreferencesType = dict(StringType, AnyType)

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#User')
const $contextVersion = 2

export class User extends Aggregate {
  /**
   * @param {{$id: URIValue, $version: Number, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined, email: EmailValue, firstname: String|undefined, lastname: String|undefined, avatar: URIValue|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: Object|undefined}} fields
   */
  constructor (fields) {
    super(Object.assign(fields, {$context, $contextVersion}))

    this.email = EmailValueType(fields.email, ['User', 'email:EmailValue'])
    this.firstname = StringType(fields.firstname, ['User', 'firstname:String'])
    this.lastname = StringType(fields.lastname, ['User', 'lastname:String'])
    this.avatar = MaybeURIValueType(fields.avatar, ['User', 'avatar:?URIValue'])
    this.superUser = BooleanType(fields.superUser || false, ['User', 'superUser:Boolean'])
    this.active = BooleanType(fields.active || false, ['User', 'active:Boolean'])
    this.preferences = PreferencesType(fields.preferences || {}, ['User', 'preferences:Map(String: Any)'])

    this.name = [this.firstname, this.lastname].join(' ')
  }

  /**
   * @returns {{$id: String, $version: Number, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, firstname: String|undefined, lastname: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        email: this.email.toString(),
        firstname: this.firstname,
        lastname: this.lastname,
        avatar: this.avatar ? this.avatar.toString() : undefined,
        superUser: this.superUser,
        active: this.active,
        preferences: JSON.stringify(this.preferences)
      }
    )
  }

  /**
   * @param {{$id: String, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, firstname: String|undefined, lastname: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}} data
   * @returns {Entity}
   */
  static fromJSON (data) {
    UserJSONType(data)
    return new User(Object.assign(
      super.fromJSON(data), {
        email: new EmailValue(data.email),
        firstname: data.firstname,
        lastname: data.lastname,
        avatar: data.avatar ? new URIValue(data.avatar) : undefined,
        superUser: data.superUser,
        active: data.active,
        preferences: JSON.parse(data.preferences)
      })
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
   * Returns true if x is of type User
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof User) || (Aggregate.is(x) && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const UserType = irreducible('UserType', User.is)
export const MaybeUserType = maybe(UserType)
export const UserJSONType = struct({
  $context: refinement(StringType, s => s === User.$context.toString(), 'UserContext'),
  $contextVersion: MaybeVersionNumberType,
  $id: StringType,
  $version: VersionNumberType,
  $createdAt: StringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType,
  email: StringType,
  firstname: StringType,
  lastname: StringType,
  avatar: MaybeStringType,
  superUser: MaybeBooleanType,
  active: MaybeBooleanType,
  preferences: StringType,
  $links: MaybeLinkListJSONType
}, 'UserJSONType')
export const MaybeUserJSONType = maybe(UserJSONType)
