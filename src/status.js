import {String as StringType, Date as DateType, irreducible, refinement, struct} from 'tcomb'
import {URIValue} from 'rheactor-value-objects'
const $context = new URIValue('https://github.com/ResourcefulHumans/staRHs-models#Status')

export class Status {
  /**
   * @param {{status: String, time: Date, version: String}} fields
   */
  constructor (fields) {
    const {status, time, version} = fields
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
    return new Status({
      status,
      time: new Date(time),
      version
    })
  }

  /**
   * @returns {URIValue}
   */
  static get $context () {
    return $context
  }
}

export const StatusJSONType = struct({
  $context: refinement(StringType, s => s === $context.toString(), 'StatusContext'),
  status: StringType,
  time: StringType,
  version: StringType
}, 'StatusJSONType')
export const StatusType = irreducible('StatusType', (x) => x instanceof Status)
