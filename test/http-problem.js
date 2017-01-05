'use strict'

/* global describe, it */

import {HttpProblem, HttpProblemType} from '../src'
import {expect} from 'chai'

function validateProblem (problem) {
  HttpProblemType(problem)
  expect(problem).to.be.instanceof(HttpProblem)
  expect(problem.type).to.equal('type')
  expect(problem.title).to.equal('title')
  expect(problem.status).to.equal(123)
  expect(problem.detail).to.equal('detail')
}
describe('HttpProblem', function () {
  describe('constructor()', () => {
    it('should accept problem information', () => {
      const problem = new HttpProblem('type', 'title', 123, 'detail')
      validateProblem(problem)
    })
    it('should parse it\'s own values', () => {
      const problem = new HttpProblem('type', 'title', 123, 'detail')
      const problem2 = new HttpProblem(
        problem.type,
        problem.title,
        problem.status,
        problem.detail
      )
      validateProblem(problem2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const problem = HttpProblem.fromJSON(JSON.parse(JSON.stringify(new HttpProblem('type', 'title', 123, 'detail'))))
      validateProblem(problem)
    })
  })
})
