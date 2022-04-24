const { given } = require('../src/given.js')
const assert = require('assert')

describe('A given value', () => {
  context('for use case', () => {
    context('structured', () => {
      context('before run', () => {
        it('should validate its structure')

        it('should document its structure')
      })

      context('with no errors', () => {
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
          assert.strictEqual(
            instance.context.description,
            'Given a simple object',
          )
          assert.deepStrictEqual(instance.context.request, { id: 1 })
          assert.deepStrictEqual(instance.context.user(), { canDoIt: true })
          assert.deepStrictEqual(instance.context.injection(), { class: 1 })
        })

        it('should audit after run')
      })
    })

    context('unstructured', () => {
      context('before run', () => {
        it('should validate its structure')

        it('should document its structure')
      })

      context('with no errors', () => {
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

        it('should audit after run')
      })
    })
  })
})
