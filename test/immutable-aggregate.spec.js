/* global describe, it */

import {expect} from 'chai'
import {ImmutableAggregate, ImmutableAggregateType, MaybeImmutableAggregateType, MaybeImmutableAggregateJSONType} from '../src'
import {URIValue} from 'rheactor-value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateImmutableAggregate (aggregate) {
  ImmutableAggregateType(aggregate)
  expect(aggregate.$id.equals(new URIValue('http://example.com/some-id'))).to.equal(true)
  expect(aggregate.$version).to.equal(17)
  expect(aggregate.$deleted).to.equal(false)
  expect(aggregate.$context.equals($context)).to.equal(true)
  expect(aggregate.$createdAt.toISOString()).to.equal(new Date('2016-01-01T00:00:00Z').toISOString())
  expect(aggregate.$links).to.deep.equal([])
}
describe('ImmutableAggregate', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateImmutableAggregate(aggregate)
    })
    it('should parse it\'s own values', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const aggregate2 = new ImmutableAggregate({
        $id: aggregate.$id,
        $version: 17,
        $context: aggregate.$context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      validateImmutableAggregate(aggregate2)
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      })
      const updated = aggregate.updated({foo: 'bar'})
      expect(aggregate.$version).to.equal(17)
      expect(updated.$version).to.equal(18)
      expect(updated).to.be.not.equal(aggregate)
      expect(updated.$updatedAt.getTime()).to.be.above(aggregate.$createdAt.getTime())
    })

    it('should apply props', () => {
      class Some extends ImmutableAggregate {
        constructor (fields) {
          super(Object.assign(fields, {$context}))
          this.foo = fields.foo
        }

        toJSON () {
          return Object.assign(
            super.toJSON(),
            {
              foo: this.foo
            }
          )
        }

        static fromJSON (data) {
          return new Some(Object.assign(
            super.fromJSON(data), {
              foo: data.foo
            })
          )
        }
      }
      const s = new Some({foo: 'bar', $version: 1, $createdAt: new Date(), $id: new URIValue('http://example.com/some-id')})
      const u = s.updated({foo: 'baz'})
      expect(s).to.not.equal(u)
      expect(u.$version).to.equal(2)
      expect(s.foo).to.equal('bar')
      expect(u.foo).to.equal('baz')
    })
  })

  describe('updated()', () => {
    it('should create a new instance', () => {
      const aggregate = new ImmutableAggregate({
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
      const aggregate = ImmutableAggregate.fromJSON(JSON.parse(JSON.stringify(new ImmutableAggregate({
        $id: new URIValue('http://example.com/some-id'),
        $version: 17,
        $context: $context,
        $createdAt: new Date('2016-01-01T00:00:00Z')
      }))))
      validateImmutableAggregate(aggregate)
    })
  })
})

describe('MaybeImmutableAggregateType', () => {
  it('should accept empty value', () => {
    MaybeImmutableAggregateType()
  })
  it('should accept correct value', () => {
    MaybeImmutableAggregateType(new ImmutableAggregate({
      $id: new URIValue('http://example.com/some-id'),
      $version: 1,
      $createdAt: new Date(),
      $context: new URIValue('http://example.com')
    }))
  })
})

describe('MaybeImmutableAggregateJSONType', () => {
  it('should accept empty value', () => {
    MaybeImmutableAggregateJSONType()
  })
  it('should accept correct value', () => {
    MaybeImmutableAggregateJSONType(new ImmutableAggregate({
      $id: new URIValue('http://example.com/some-id'),
      $version: 1,
      $createdAt: new Date(),
      $context: new URIValue('http://example.com')
    }).toJSON())
  })
})
