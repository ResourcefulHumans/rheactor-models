import {Aggregate} from './aggregate'
import {VersionNumberType} from './types'
import {EmailValue, EmailValueType, URIValue, MaybeURIValueType} from 'rheactor-value-objects'
import {maybe, irreducible, String as StringType, Any as AnyType, Boolean as BooleanType, struct, dict} from 'tcomb'
const MaybeBooleanType = maybe(BooleanType)
const MaybeStringType = maybe(StringType)
const PreferencesType = dict(StringType, AnyType)

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#User')

export class User extends Aggregate {
  /**
   * @param {{$id: URIValue, $version: Number, $createdAt: Date|undefined, $updatedAt: Date|undefined, $deletedAt: Date|undefined, email: EmailValue, firstname: String|undefined, lastname: String|undefined, avatar: URIValue|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: Object|undefined}} fields
   */
  constructor (fields) {
    const {email, firstname, lastname, avatar, superUser, active, preferences} = fields
    EmailValueType(email, ['User', 'email:EmailValue'])
    StringType(firstname, ['User', 'firstname:String'])
    StringType(lastname, ['User', 'lastname:String'])
    MaybeURIValueType(avatar, ['User', 'avatar:?URIValue'])
    BooleanType(superUser || false, ['User', 'superUser:Boolean'])
    BooleanType(active || false, ['User', 'active:Boolean'])
    PreferencesType(preferences || {}, ['User', 'preferences:Map(String: Any)'])
    super(Object.assign(fields, {$context}))
    this.email = email
    this.firstname = firstname
    this.lastname = lastname
    this.name = [this.firstname, this.lastname].join(' ')
    this.avatar = avatar
    this.superUser = superUser || false
    this.active = active || false
    this.preferences = preferences
  }

  /**
   * @returns {{$id: String, $version: Number, $deleted: Boolean, $context: String, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, firstname: String|undefined, lastname: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}}
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
   * @param {{$id: String, $context: String, $deleted: Boolean, $links: Array<Link>, $createdAt: String|undefined, $updatedAt: String|undefined, $deletedAt: String|undefined, email: String, firstname: String|undefined, lastname: String|undefined, avatar: String|undefined, superUser: Boolean|undefined, active: Boolean|undefined, preferences: String}} data
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
   * Returns true if x is of type User
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof User) || (Aggregate.is(x) && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const UserJSONType = struct({
  $id: StringType,
  $version: VersionNumberType,
  $deleted: MaybeBooleanType,
  $createdAt: StringType,
  $updatedAt: MaybeStringType,
  $deletedAt: MaybeStringType,
  email: StringType,
  firstname: StringType,
  lastname: StringType,
  avatar: MaybeStringType,
  superUser: MaybeBooleanType,
  active: MaybeBooleanType,
  preferences: StringType
}, 'UserJSONType')
export const UserType = irreducible('UserType', User.is)
