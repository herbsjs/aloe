const { spec } = require('../src/spec')
const { usecase } = require('@herbsjs/herbs')

const assert = require('assert')

describe('A spec', () => {
  context('the simplest use case spec', () => {
    const givenTheSimplestUCSpec = () => {
      const AUseCase = usecase('A generic use case', {})

      const ASpec = spec({
        usecase: AUseCase,
      })

      return ASpec
    }

    it('should initiate', () => {
      //given
      const aSpec = givenTheSimplestUCSpec()

      //then
      assert.strictEqual(aSpec.usecase.description, 'A generic use case')
    })

    it('should validate its structure')

    it('should document its structure')

    it('should audit after run')
  })
})
