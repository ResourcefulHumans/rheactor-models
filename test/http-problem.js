'use strict'

/* global describe, it */

const HttpProblem = require('../http-problem')
const expect = require('chai').expect

describe('HttpProblem()', function () {
  it('should accept problem information', () => {
    const problem = new HttpProblem('type', 'title', 123, 'detail')
    expect(problem).to.be.instanceof(HttpProblem)
    expect(problem.type).to.equal('type')
    expect(problem.title).to.equal('title')
    expect(problem.status).to.equal(123)
    expect(problem.detail).to.equal('detail')
  })
})
