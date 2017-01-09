import {String as StringType, Date as DateType, irreducible, refinement, struct} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#Status')

export class Status {
  /**
   * @param {String} status
   * @param {Date} time
   * @param {String} version
   */
  constructor (status, time, version) {
    StringType(status)
    DateType(time)
    StringType(version)
    this.status = status
    this.time = time
    this.version = version
    this.$context = this.constructor.$context
  }

  /**
   * @returns {{status: String, time: String, version: String, $context: String}}
   */
  toJSON () {
    return {
      status: this.status,
      time: this.time.toISOString(),
      version: this.version,
      $context: this.$context.toString()
    }
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
   * Returns true if x is of type Status
   *
   * @param {object} x
   * @returns {boolean}
   */
  static is (x) {
    return (x instanceof Status) || (x && x.constructor && x.constructor.name === Status.name && '$context' in x && URIValue.is(x.$context) && $context.equals(x.$context))
  }
}

export const StatusJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'StatusContext'),
  status: StringType,
  time: StringType,
  version: StringType
}, 'StatusJSONType')
export const StatusType = irreducible('StatusType', Status.is)
