/* global describe, it */

import {expect} from 'chai'
import {Link, LinkType, MaybeLinkType, MaybeLinkJSONType} from '../src'
import {URIValue} from 'rheactor-value-objects'

function validateLink (link) {
  LinkType(link)
  expect(link.href.equals(new URIValue('http://example.com/some-item/42'))).to.equal(true)
  expect(link.subject.equals(new URIValue('http://example.com/jsonld/some'))).to.equal(true)
  expect(link.list).to.equal(false)
  expect(link.rel).to.equal(undefined)
  expect(link.$context.equals(Link.$context)).to.equal(true)
}
describe('Link', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const link = new Link(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some'))
      validateLink(link)
    })
    it('should accept list and rel arguments', () => {
      const link = new Link(
        new URIValue('http://example.com/some-item/42'),
        new URIValue('http://example.com/jsonld/some'),
        true,
        'next'
      )
      expect(link.list).to.equal(true)
      expect(link.rel).to.equal('next')
    })
    it('should parse it\'s own values', () => {
      const link = new Link(
        new URIValue('http://example.com/some-item/42'),
        new URIValue('http://example.com/jsonld/some')
      )
      const link2 = new Link(
        link.href,
        link.subject,
        link.list,
        link.rel
      )
      validateLink(link2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const link = Link.fromJSON(JSON.parse(JSON.stringify(new Link(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some')))))
      validateLink(link)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Link.$context.toString()).to.equal('https://github.com/ResourcefulHumans/rheactor-models#Link')
    })
  })
})

describe('MaybeLinkType', () => {
  it('should accept empty value', () => {
    MaybeLinkType()
  })
  it('should accept correct value', () => {
    MaybeLinkType(new Link(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ))
  })
})

describe('MaybeLinkJSONType', () => {
  it('should accept empty value', () => {
    MaybeLinkJSONType()
  })
  it('should accept correct value', () => {
    MaybeLinkJSONType(new Link(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ).toJSON())
  })
})
