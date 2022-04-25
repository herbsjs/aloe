const { scenario } = require('../src/scenario')
const assert = require('assert')
const { given } = require('../src/given')
const { when } = require('../src/when')
const { check } = require('../src/check')
const { state } = require('../src/runningState')

describe('A scenario', () => {
  context('before run', () => {
    const givenTheSimplestScenario = () => {
      const instance = scenario({
        info: 'A simple scenario',
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'b')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'x')
        }),
      })
      instance.description = 'A "Scenario" description'
      return instance
    }

    it('should validate its structure')

    it('should document its structure', async () => {
      //given
      const instance = givenTheSimplestScenario()

      //when
      const ret = await instance.doc()

      //then
      assert.deepStrictEqual(
        ret,
        {
          type: 'scenario',
          description: 'A "Scenario" description',
          info: 'A simple scenario',
          givens: [
            { type: 'given', description: 'Given a input', value: { user: 'a' }, isFunction: true },
            { type: 'given', description: 'Given another input', value: { customer: 'x', project: 'w' }, isFunction: true }
          ],
          whens: [{ type: 'when', description: 'When running' }],
          checks: [
            { type: 'check', description: 'Check output' },
            { type: 'check', description: 'Check another output' }
          ]
        },
      )
    })
  })

  context('with no errors', () => {
    const givenTheSimplestScenario = () => {
      return scenario({
        info: 'A simple scenario',
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'b')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'x')
        }),
      })
    }

    it('should run', async () => {
      //given
      const instance = givenTheSimplestScenario()
      //when
      const ret = await instance.run()

      //then
      // - firts, it should not throw a exception, then:
      assert.ok(ret, state.passed)
      assert.strictEqual(instance.info, 'A simple scenario')
      assert.strictEqual(instance.state, state.passed)
      assert.strictEqual(instance.givens[0].description, 'Given a input')
      assert.strictEqual(instance.givens[0].state, state.done)
      assert.strictEqual(instance.givens[1].description, 'Given another input')
      assert.strictEqual(instance.givens[1].state, state.done)
      assert.strictEqual(instance.whens[0].description, 'When running')
      assert.strictEqual(instance.whens[0].state, state.done)
      assert.strictEqual(instance.checks[0].description, 'Check output')
      assert.strictEqual(instance.checks[0].state, state.passed)
      assert.strictEqual(instance.checks[1].description, 'Check another output')
      assert.strictEqual(instance.checks[1].state, state.passed)
    })

    it('should audit after run')

    it('should not be allow to run more than once')
  })

  context('with errors', () => {
    const givenTheSimplestScenario = () => {
      return scenario({
        info: 'A simple scenario',
        'Given a input': given(() => ({
          user: 'a',
        })),
        'Given another input': given(() => ({
          customer: 'x',
          project: 'w',
        })),
        'When running': when((ctx) => {
          ctx.user = 'b'
        }),
        'Check output': check((ctx) => {
          assert.ok(ctx.user === 'a')
        }),
        'Check another output': check((ctx) => {
          assert.ok(ctx.customer === 'z')
        }),
      })
    }

    it('should run', async () => {
      //given
      const instance = givenTheSimplestScenario()
      //when
      const ret = await instance.run()

      //then
      // - firts, it should not throw a exception, then:
      assert.strictEqual(ret, state.failed)
      assert.strictEqual(instance.info, 'A simple scenario')
      assert.strictEqual(instance.state, state.failed)
      assert.strictEqual(instance.givens[0].description, 'Given a input')
      assert.strictEqual(instance.givens[0].state, state.done)
      assert.strictEqual(instance.givens[1].description, 'Given another input')
      assert.strictEqual(instance.givens[1].state, state.done)
      assert.strictEqual(instance.whens[0].description, 'When running')
      assert.strictEqual(instance.whens[0].state, state.done)
      assert.strictEqual(instance.checks[0].description, 'Check output')
      assert.strictEqual(instance.checks[0].state, state.failed)
      assert.strictEqual(instance.checks[1].description, 'Check another output')
      assert.strictEqual(instance.checks[1].state, state.failed)
    })

    it('should audit after run')

    it('should not be allow to run more than once')
  })
})
