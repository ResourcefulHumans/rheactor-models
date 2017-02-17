/* global describe, it */

import {expect} from 'chai'
import {Reference, ReferenceType, MaybeReferenceType, MaybeReferenceJSONType} from '../src'
import {URIValue} from 'rheactor-value-objects'

function validateReference (reference) {
  ReferenceType(reference)
  expect(reference.$id.equals(new URIValue('http://example.com/some-item/42'))).to.equal(true)
  expect(reference.subject.equals(new URIValue('http://example.com/jsonld/some'))).to.equal(true)
  expect(reference.$context.equals(Reference.$context)).to.equal(true)
}
describe('Reference', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const reference = new Reference(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some'))
      validateReference(reference)
    })
    it('should parse it\'s own values', () => {
      const reference = new Reference(
        new URIValue('http://example.com/some-item/42'),
        new URIValue('http://example.com/jsonld/some')
      )
      const reference2 = new Reference(
        reference.$id,
        reference.subject
      )
      validateReference(reference2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const reference = Reference.fromJSON(JSON.parse(JSON.stringify(new Reference(new URIValue('http://example.com/some-item/42'), new URIValue('http://example.com/jsonld/some')))))
      validateReference(reference)
    })
  })

  describe('$context', () => {
    it('should exist', () => {
      expect(Reference.$context.toString()).to.equal('https://github.com/ResourcefulHumans/rheactor-models#Reference')
    })
  })
})

describe('MaybeReferenceType', () => {
  it('should accept empty value', () => {
    MaybeReferenceType()
  })
  it('should accept correct value', () => {
    MaybeReferenceType(new Reference(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ))
  })
})

describe('MaybeReferenceJSONType', () => {
  it('should accept empty value', () => {
    MaybeReferenceJSONType()
  })
  it('should accept correct value', () => {
    MaybeReferenceJSONType(new Reference(
      new URIValue('http://example.com/some-item/42'),
      new URIValue('http://example.com/jsonld/some')
    ).toJSON())
  })
})
