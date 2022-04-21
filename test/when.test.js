const { when } = require('../src/when.js')
const assert = require('assert')
const { state } = require('../src/runningState.js')

describe('A when function', () => {
  describe('passing', () => {
    const givenAPassingWhenFunction = () => {
      return when(() => true)
    }

    it('should run', async () => {
      //given
      const instance = givenAPassingWhenFunction()
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.done)
    })

    it('should audit after run')
  })

  describe('failing', () => {
    const givenAFailingWhenFunction = () => {
      return when(() => {
        throw new Error('A error from a when function')
      })
    }

    it('should run', async () => {
      //given
      const instance = givenAFailingWhenFunction()
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.failed)
    })

    it('should audit after run')
  })

  it('should validates its structure')

  it('should document its structure')
})
