/* global describe, it */

import {expect} from 'chai'
import {Aggregate, AggregateType, MaybeAggregateType} from '../src'
import {URIValue} from 'rheactor-value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateAggregate (aggregate) {
  AggregateType(aggregate)
  expect(aggregate.$id.equals(new URIValue('http://example.com/some-id'))).to.equal(true)
  expect(aggregate.$version).to.equal(17)
  expect(aggregate.$deleted).to.equal(false)
  expect(aggregate.$context.equals($context)).to.equal(true)
  expect(aggregate.$createdAt.toISOString()).to.equal(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(aggregate.$links).to.deep.equal([])
}
describe('Aggregate', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const aggregate = new Aggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateAggregate(aggregate)
    })
    it('should parse it\'s own values', () => {
      const aggregate = new Aggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const aggregate2 = new Aggregate({
        $id: aggregate.$id,
        $version: 17,
        $context: aggregate.$context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateAggregate(aggregate2)
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new Aggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const updated = aggregate.updated()
      expect(aggregate.$version).to.equal(17)
      expect(updated.$version).to.equal(18)
      expect(updated).to.be.not.equal(aggregate)
      expect(updated.$updatedAt.getTime()).to.be.above(aggregate.$createdAt.getTime())
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new Aggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const deleted = aggregate.deleted()
      expect(aggregate.$version).to.equal(17)
      expect(deleted.$deleted).to.equal(true)
      expect(deleted.$version).to.equal(18)
      expect(deleted).to.be.not.equal(aggregate)
      expect(deleted.$deletedAt.getTime()).to.be.above(aggregate.$createdAt.getTime())
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const aggregate = Aggregate.fromJSON(JSON.parse(JSON.stringify(new Aggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      }))))
      validateAggregate(aggregate)
    })
  })
})

describe('MaybeAggregateType', () => {
  it('should accept empty value', () => {
    MaybeAggregateType()
  })
  it('should accept correct value', () => {
    MaybeAggregateType(new Aggregate({
      $id: new URIValue('http://example.com/some-id'),
      $version: 1,
      $createdAt: new Date(),
      $context: new URIValue('http://example.com')
    }))
  })
})

