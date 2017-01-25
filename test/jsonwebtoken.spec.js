/* global describe, it */

import {JsonWebToken, JsonWebTokenType, MaybeJsonWebTokenType} from '../src'
import {expect} from 'chai'
import jwt from 'jsonwebtoken'

function validateToken (webtoken) {
  expect(webtoken).to.be.instanceof(JsonWebToken)
  expect(webtoken.iss).to.equal('test')
  expect(webtoken.sub).to.equal('foo')
  const nbfTime = Date.now() - 60000
  expect(webtoken.nbf.getTime()).to.be.within(nbfTime - 1000, nbfTime + 1000)
  expect(webtoken.payload).to.deep.equal({foo: 'bar'})
  const inOnHourinSeconds = Math.round((Date.now() + (60 * 60 * 1000)) / 1000)
  expect(Math.round(new Date(webtoken.exp).getTime() / 1000)).to.be.within(inOnHourinSeconds - 10, inOnHourinSeconds + 10)
  jwt.verify(webtoken.token, 'mysecret')
}

describe('JsonWebToken', function () {
  describe('constructor', () => {
    it('should parse a token', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = new JsonWebToken(token)
      validateToken(webtoken)
    })

    it('should parse it\'s own values', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = new JsonWebToken(token)
      const webtoken2 = new JsonWebToken(webtoken.token)
      validateToken(webtoken2)
    })
  })

  describe('isExpired()', () => {
    it('should return true if a token is expired', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: -10})
      const webtoken = new JsonWebToken(token)
      expect(webtoken.isExpired()).to.equal(true)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = JsonWebToken.fromJSON(JSON.parse(JSON.stringify(new JsonWebToken(token))))
      JsonWebTokenType(webtoken)
      validateToken(webtoken)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(JsonWebToken.$context.toString()).to.equal('https://tools.ietf.org/html/rfc7519')
    })
  })
})

describe('MaybeJsonWebTokenType', () => {
  it('should accept empty value', () => {
    MaybeJsonWebTokenType()
  })
  it('should accept correct value', () => {
    const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
    MaybeJsonWebTokenType(new JsonWebToken(token))
  })
})
