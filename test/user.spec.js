'use strict'

/* global describe, it */

import {expect} from 'chai'
import {User, UserType} from '../src'
import {URIValue, EmailValue} from 'rheactor-value-objects'

const $context = new URIValue('https://github.com/ResourcefulHumans/rheactor-models#User')

function validateUser (user) {
  UserType(user)
  expect(user.$id).to.equal('some-id')
  expect(user.$version).to.equal(17)
  expect(user.$deleted).to.equal(false)
  expect(user.$context.equals($context)).to.equal(true)
  expect(user.$createdAt.toISOString()).to.equal(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(user.$links).to.deep.equal([])
}
describe('User', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const user = new User({
        $id: 'some-id',
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        firstname: 'John',
        lastname: 'Doe'
      })
      validateUser(user)
    })
    it('should parse it\'s own values', () => {
      const user = new User({
        $id: 'some-id',
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        firstname: 'John',
        lastname: 'Doe'
      })
      const user2 = new User({
        $id: user.$id,
        $version: 17,
        $context: user.$context,
        $createdAt: user.$createdAt,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      })
      validateUser(user2)
    })
  })

  describe('updated() (inherited from Aggregate)', () => {
    it('should create a new instance', () => {
      const user = new User({
        $id: 'some-id',
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        firstname: 'John',
        lastname: 'Doe'
      })
      const updated = user.updated()
      expect(user.$version).to.equal(17)
      expect(updated.$version).to.equal(18)
      expect(updated).to.be.not.equal(user)
      expect(updated.$updatedAt.getTime()).to.be.above(user.$createdAt.getTime())
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const user = User.fromJSON(JSON.parse(JSON.stringify(new User({
        $id: 'some-id',
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z'),
        email: new EmailValue('john@example.com'),
        firstname: 'John',
        lastname: 'Doe'
      }))))
      validateUser(user)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(User.$context.toString()).to.equal('https://github.com/ResourcefulHumans/rheactor-models#User')
    })
  })
})
