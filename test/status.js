/* global describe, it */

import {Status, StatusType, MaybeStatusType} from '../src'
import {expect} from 'chai'

const now = new Date()
function validateStatus (problem) {
  StatusType(problem)
  expect(problem).to.be.instanceof(Status)
  expect(problem.status).to.equal('ok')
  expect(problem.time.getTime()).to.equal(now.getTime())
  expect(problem.version).to.equal('1.8.0+production.1483709132405')
}
describe('Status', function () {
  describe('constructor()', () => {
    it('should accept status', () => {
      const problem = new Status('ok', now, '1.8.0+production.1483709132405')
      validateStatus(problem)
    })
    it('should parse it\'s own values', () => {
      const problem = new Status('ok', now, '1.8.0+production.1483709132405')
      const problem2 = new Status(
        problem.status,
        problem.time,
        problem.version
      )
      validateStatus(problem2)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Status.$context.toString()).to.equal('https://github.com/ResourcefulHumans/rheactor-models#Status')
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const problem = Status.fromJSON(JSON.parse(JSON.stringify(new Status('ok', now, '1.8.0+production.1483709132405'))))
      validateStatus(problem)
    })
  })
})

describe('MaybeStatusType', () => {
  it('should accept empty value', () => {
    MaybeStatusType()
  })
  it('should accept correct value', () => {
    MaybeStatusType(new Status('ok', now, '1.8.0+production.1483709132405'))
  })
})

