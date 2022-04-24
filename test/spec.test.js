const { spec } = require('../src/spec')
const { usecase, step, Ok, Err } = require('@herbsjs/herbs')

const assert = require('assert')
const { scenario } = require('../src/scenario')
const { given } = require('../src/given')
const { when } = require('../src/when')
const { check } = require('../src/check')
const { state } = require('../src/runningState')

describe('A spec', () => {
  context('generic', () => {
    context('before run', () => {
      it('should validate its structure')

      it('should document its structure')
    })

    context('with no errors', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              user: 'a',
            })),
            'When running': when((ctx) => {
              ctx.user = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.user === 'b')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.passed)
        assert.strictEqual(
          instance.scenarios[0].description,
          'A simple scenario',
        )
        assert.strictEqual(instance.scenarios[0].state, state.passed)
      })

      it('should audit after run')
    })

    context('with errors', () => {
      const givenTheSimplestGenericSpec = () => {
        const ASpec = spec({
          'A simple scenario': scenario({
            info: 'A simple scenario',
            'Given a input': given(() => ({
              user: 'a',
            })),
            'When running': when((ctx) => {
              ctx.user = 'b'
            }),
            'Check another output': check((ctx) => {
              assert.ok(ctx.user === 'c')
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestGenericSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.failed)
        assert.ok(instance.scenarios[0].usecase === undefined)
        assert.strictEqual(instance.scenarios[0].state, state.failed)
      })

      it('should audit after run')
    })
  })
  context('for use case', () => {
    context('before run', () => {
      it('should validate its structure')

      it('should document its structure')
    })

    context('with no errors', () => {
      const givenTheSimplestUCSpec = () => {
        const AUseCase = (injection) =>
          usecase('A generic use case', {
            request: { user: String },
            authorize: async (user) => (user.can ? Ok() : Err()),
            'A step 1': step((ctx) => {
              ctx.customer = injection.customer
              return Ok()
            }),
            'A step 2': step((ctx) => {
              ctx.ret = { user: ctx.req.user, customer: ctx.customer }
              return Ok()
            }),
          })

        const ASpec = spec({
          usecase: AUseCase,
          'A simple scenario': scenario({
            'Given a input': given({
              request: {
                user: 'a',
              },
              user: { can: true },
              injection: {
                customer: 1,
              },
            }),

            // when: default when for use case

            'Check another output': check((ctx) => {
              assert.ok(ctx.response.value.user === 'a')
              assert.ok(ctx.response.value.customer === 1)
            }),
          }),
        })

        return ASpec
      }

      it('should run', async () => {
        //given
        const instance = givenTheSimplestUCSpec()
        //when
        const ret = await instance.run()
        //then
        // - firts, it should not throw a exception, then:
        assert.strictEqual(ret, state.passed)
        assert.strictEqual(instance.usecase.name, 'AUseCase')
        assert.strictEqual(
          instance.scenarios[0].description,
          'A simple scenario',
        )
        assert.ok(instance.scenarios[0].usecase !== undefined)
        assert.strictEqual(instance.scenarios[0].state, state.passed)
      })

      it('should audit after run')
    })

    it('with errors')
  })

  it('for an entity')
})
