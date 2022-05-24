const { given } = require('../src/given.js')
const assert = require('assert')

describe('A given value', () => {
  context('before run', () => {
    const givenAGenericGiven = () => {
      const instance = given({
        id: 1,
      })
      instance.description = 'A "Given" description'
      return instance
    }

    it('should validate its structure')

    it('should document its structure', async () => {
      //given
      const instance = givenAGenericGiven()

      //when
      const ret = await instance.doc()

      //then
      assert.deepStrictEqual(
        ret,
        { type: 'given', description: 'A "Given" description', value: { id: 1 }, isFunction: false },
      )
    })
  })

  context('structured', () => {
    context('passing', () => {
      const givenAStructuredGivenForUseCases = () => {
        return given({
          description: 'Given a simple object',
          request: { id: 1 },
          user: () => ({ canDoIt: true }),
          injection: () => ({ class: 1 }),
        })
      }

      it('should return its value', async () => {
        //given
        const instance = givenAStructuredGivenForUseCases()

        //when
        const ret = await instance.run()

        //then
        assert.strictEqual(instance.context.description, 'Given a simple object')
        assert.deepStrictEqual(instance.context.request, { id: 1 })
        assert.deepStrictEqual(instance.context.user(), { canDoIt: true })
        assert.deepStrictEqual(instance.context.injection(), { class: 1 })
      })

      it('should audit after run', async () => {
        //given
        const instance = givenAStructuredGivenForUseCases()

        //when
        const ret = await instance.run()

        //then
        assert.deepStrictEqual(instance.auditTrail, { type: 'given', state: 'done', description: undefined })
      })
    })

    it('failing')

  })

  context('unstructured', () => {
    context('passing', () => {
      const givenAnUnstructuredGiven = () => {
        return given(() => ({
          description: 'Given a simple object',
          request: { id: 1 },
          user: () => ({ canDoIt: true }),
          injection: () => ({ class: 1 }),
        }))
      }

      it('should return its value', async () => {
        //given
        const instance = givenAnUnstructuredGiven()

        //when
        const ret = await instance.run()

        //then
        assert.strictEqual(
          instance.context.description,
          'Given a simple object',
        )
        assert.deepStrictEqual(instance.context.request, { id: 1 })
        assert.deepStrictEqual(instance.context.user(), { canDoIt: true })
        assert.deepStrictEqual(instance.context.injection(), { class: 1 })
      })

      it('should audit after run', async () => {
        //given
        const instance = givenAnUnstructuredGiven()

        //when
        const ret = await instance.run()

        //then
        assert.deepStrictEqual(instance.auditTrail, { type: 'given', state: 'done', description: undefined })
      })
    })

    it('failing')
  })
})
