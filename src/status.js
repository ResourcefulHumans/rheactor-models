import {String as StringType, Date as DateType, maybe, refinement, irreducible, struct} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
import {Model} from './model'
import {MaybeVersionNumberType} from './types'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Status')
const $contextVersion = 1

export class Status extends Model {
  /**
   * @param {String} status
   * @param {Date} time
   * @param {String} version
   */
  constructor (status, time, version) {
    super({$context, $contextVersion})
    this.status = StringType(status)
    this.time = DateType(time)
    this.version = StringType(version)
  }

  /**
   * @returns {{status: String, time: String, version: String, $context: String, $contextVersion: Number}}
   */
  toJSON () {
    return Object.assign(
      super.toJSON(),
      {
        status: this.status,
        time: this.time.toISOString(),
        version: this.version
      }
    )
  }

  /**
   * @param {{status: String, time: Date}} data
   * @returns {Status}
   */
  static fromJSON (data) {
    StatusJSONType(data)
    const {status, time, version} = data
    return new Status(status, new Date(time), version)
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
   * Returns true if x is of type Status
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Status) || (x && x.constructor && x.constructor.name === Status.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const StatusType = irreducible('StatusType', Status.is)
export const MaybeStatusType = maybe(StatusType)
export const StatusJSONType = struct({
  $context: refinement(StringType, s => s === Status.$context.toString(), 'StatusContext'),
  $contextVersion: MaybeVersionNumberType,
  status: StringType,
  time: StringType,
  version: StringType
}, 'StatusJSONType')
