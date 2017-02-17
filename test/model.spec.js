/* global describe, it */

import {expect} from 'chai'
import {Model, ModelType, MaybeModelType, MaybeModelJSONType} from '../src'
import {URIValue} from 'rheactor-value-objects'

const $context = new URIValue('http://example.com/jsonld/some')

function validateModel (model) {
  ModelType(model)
  expect(model.$context.equals($context)).to.equal(true)
  expect(model.$links).to.deep.equal([])
}
describe('Model', () => {
  describe('constructor()', () => {
    it('should accept values', () => {
      const model = new Model({$context})
      validateModel(model)
    })
    it('should parse it\'s own values', () => {
      const model = new Model({$context})
      const model2 = new Model({
        $context: model.$context
      })
      validateModel(model2)
    })
  })

  describe('JSON', () => {
    it('should parse it\'s JSON representation', () => {
      const model = Model.fromJSON(JSON.parse(JSON.stringify(new Model({$context}))))
      validateModel(model)
    })
  })
})

describe('MaybeModelType', () => {
  it('should accept empty value', () => {
    MaybeModelType()
  })
  it('should accept correct value', () => {
    MaybeModelType(new Model({$context}))
  })
})

describe('MaybeModelJSONType', () => {
  it('should accept empty value', () => {
    MaybeModelJSONType()
  })
  it('should accept correct value', () => {
    MaybeModelJSONType(new Model({$context}).toJSON())
  })
})
