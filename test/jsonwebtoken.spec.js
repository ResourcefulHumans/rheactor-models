/* global describe, it */
import {JsonWebToken, JsonWebTokenType, MaybeJsonWebTokenType, Link, MaybeJsonWebTokenJSONType} from '../src'
import {URIValue} from 'rheactor-value-objects'
import {expect} from 'chai'
import jwt from 'jsonwebtoken'

function validateToken (webtoken) {
  expect(webtoken).to.be.instanceof(JsonWebToken)
  expect(webtoken.$context.toString()).to.be.equal('https://tools.ietf.org/html/rfc7519')
  expect(webtoken.$contextVersion).to.be.equal(2)
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

  describe('$contextVersion', () => {
    it('should exist', () => {
      expect(JsonWebToken.$contextVersion).to.be.equal(2)
    })
    it('should be contained in the JSON', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      expect(new JsonWebToken(token).toJSON().$contextVersion).to.equal(2)
    })
  })

  describe('$links', () => {
    it('should parse links', () => {
      const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
      const webtoken = JsonWebToken.fromJSON(JSON.parse(JSON.stringify(new JsonWebToken(token, [new Link(
        new URIValue('http://127.0.0.1:8080/api/token/verify'),
        new URIValue('https://tools.ietf.org/html/rfc7519'),
        false,
        'token-verify'
      )
      ]))))
      expect(Link.is(webtoken.$links[0]), 'it should be a link').to.equal(true)
      expect(webtoken.$links[0].rel).to.equal('token-verify')
      expect(webtoken.$links[0].list, 'it should not be a list').to.equal(false)
      expect(webtoken.$links[0].$context.equals(Link.$context), 'it should be a link').to.equal(true)
      expect(webtoken.$links[0].subject.equals(new URIValue('https://tools.ietf.org/html/rfc7519')), 'subject should match').to.equal(true)
      expect(webtoken.$links[0].href.equals(new URIValue('http://127.0.0.1:8080/api/token/verify')), 'href should match').to.equal(true)
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

describe('MaybeJsonWebTokenJSONType', () => {
  it('should accept empty value', () => {
    MaybeJsonWebTokenJSONType()
  })
  it('should accept correct value', () => {
    const token = jwt.sign({foo: 'bar'}, 'mysecret', {algorithm: 'HS256', issuer: 'test', subject: 'foo', expiresIn: 60 * 60, notBefore: -60})
    MaybeJsonWebTokenJSONType(new JsonWebToken(token).toJSON())
  })
})
