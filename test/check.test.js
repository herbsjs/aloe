const { check } = require('../src/check.js')
const assert = require('assert')
const { state } = require('../src/runningState.js')

describe('A check function', () => {
  context('before run', () => {
    it('should validate its structure')

    it('should document its structure')
  })

  context('passing', () => {
    const givenAPassingCheckFunction = () => {
      return check(() => true)
    }

    it('should run', async () => {
      //given
      const instance = givenAPassingCheckFunction()
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.passed)
    })

    it('should audit after run')
  })

  context('failing', () => {
    const givenAFailingCheckFunction = () => {
      return check(() => {
        throw new Error('A error from a check function')
      })
    }

    it('should run', async () => {
      //given
      const instance = givenAFailingCheckFunction()
      //when
      const ret = await instance.run()
      //then
      assert.ok(ret === state.failed)
    })

    it('should audit after run')
  })

})
