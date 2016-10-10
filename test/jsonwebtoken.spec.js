'use strict'

/* global describe, it */

const JsonWebToken = require('../jsonwebtoken')
const jwt = require('jsonwebtoken')
const expect = require('chai').expect

describe('JsonWebToken()', function () {
  it('should parse a token', () => {
    const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
    const webtoken = new JsonWebToken(token)
    expect(webtoken).to.be.instanceof(JsonWebToken)
    expect(webtoken.iss).to.equal('test')
    expect(webtoken.sub).to.equal('foo')
    const nbfTime = Date.now() - 60000
    expect(webtoken.nbf.getTime()).to.be.within(nbfTime - 1000, nbfTime + 1000)
    expect(webtoken.payload).to.deep.equal({foo: 'bar'})
    const inOnHourinSeconds = Math.round((Date.now() + (60 * 60 * 1000)) / 1000)
    expect(Math.round(new Date(webtoken.exp).getTime() / 1000)).to.be.within(inOnHourinSeconds - 10, inOnHourinSeconds + 10)
    jwt.verify(webtoken.token, 'mysecret')
  })

  describe('isExpired()', () => {
    it('should return true if a token is expired', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: -10})
      const webtoken = new JsonWebToken(token)
      expect(webtoken.isExpired()).to.equal(true)
    })
  })
})
