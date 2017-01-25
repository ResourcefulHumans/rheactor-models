/* global describe, it */

import {expect} from 'chai'
import {Link, Model, Index, IndexType, MaybeIndexType} from '../src'
import {URIValue} from 'rheactor-value-objects'

const links = [
  new Link(
    new URIValue('http://example.com/some-item/42'),
    new URIValue('http://example.com/jsonld/some'),
    false,
    'me'
  ),
  new Link(
    new URIValue('http://example.com/some-item'),
    new URIValue('http://example.com/jsonld/some'),
    true,
    'foo'
  )
]

function validateIndex (list) {
  IndexType(list)
  expect(list.$context.equals(Index.$context)).to.equal(true)
  expect(list.$links).to.deep.equal(links)
}
describe('Index', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const list = new Index(links)
      validateIndex(list)
    })
    it('should parse it\'s own values', () => {
      const list = new Index(links)
      const list2 = new Index(list.$links)
      validateIndex(list2)
    })
    it('should not accept an empty list of links', () => {
      expect(() => new Index()).to.throw(/expected an array of Link/)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const list = Index.fromJSON(JSON.parse(JSON.stringify(new Index(links))), Model.fromJSON)
      validateIndex(list)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Index.$context.toString()).to.equal('https://github.com/ResourcefulHumans/rheactor-models#Index')
    })
  })
})

describe('MaybeIndexType', () => {
  it('should accept empty value', () => {
    MaybeIndexType()
  })
  it('should accept correct value', () => {
    MaybeIndexType(new Index([]))
  })
})
