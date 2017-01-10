'use strict'

/* global describe, it */

import {HttpProblem, HttpProblemType} from '../src'
import {URIValue} from 'rheactor-value-objects'
import {expect} from 'chai'

function validateProblem (problem) {
  HttpProblemType(problem)
  expect(problem).to.be.instanceof(HttpProblem)
  expect(problem.type.equals(new URIValue('http://example.com'))).to.equal(true)
  expect(problem.title).to.equal('title')
  expect(problem.status).to.equal(123)
  expect(problem.detail).to.equal('detail')
}
describe('HttpProblem', function () {
  describe('constructor()', () => {
    it('should accept problem information', () => {
      const problem = new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail')
      validateProblem(problem)
    })
    it('should parse it\'s own values', () => {
      const problem = new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail')
      const problem2 = new HttpProblem(
        problem.type,
        problem.title,
        problem.status,
        problem.detail
      )
      validateProblem(problem2)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(HttpProblem.$context.toString()).to.equal('https://www.ietf.org/id/draft-ietf-appsawg-http-problem-01.txt')
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const problem = HttpProblem.fromJSON(JSON.parse(JSON.stringify(new HttpProblem(new URIValue('http://example.com'), 'title', 123, 'detail'))))
      validateProblem(problem)
    })
  })
})
