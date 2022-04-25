const { Err } = require('@herbsjs/herbs')
const { state } = require('./runningState')
const { when } = require('./when')

class Scenario {
  constructor(body) {
    this.type = 'scenario'
    this.state = state.ready
    this._auditTrail = { type: this.type, state: this.state }
    this._body = body
  }

  async run() {
    this.build()

    // given
    for (const given of this.givens) {
      await given.run()
      if (given.state === state.failed) throw new Error({ given })
    }

    // context
    this.context = this.givens
      .map((given) => given.context)
      .reduce((prev, current) => Object.assign(prev, current))
    if (this.usecase) this.context.usecase = this.usecase

    // when
    for (const when of this.whens) {
      await when.run(this.context)
      if (when.state === state.failed) throw new Error({ when })
    }

    // checks
    for (const check of this.checks) {
      await check.run(this.context)
    }
    this.state = this.checks.find((check) => check.state === state.failed)
      ? state.failed
      : state.passed

    return this.state
  }

  build() {
    const description = (entries) => {
      const [description, instance] = entries
      instance.description = description
      return instance
    }
    const builtinWhen = () => {
      if (!this.usecase) return
      if (this.whens.length > 0) return
      const builtinWhen = when(async (ctx) => {
        const injection = ctx.injection
        const uc = ctx.usecase(injection)

        const hasAccess = await uc.authorize(ctx.user)

        if (hasAccess === false) {
          ctx.response = Err.permissionDenied()
          return
        }

        const request = ctx.request
        ctx.response = await uc.run(request)
      })

      builtinWhen.builtin = true
      this.whens.push(builtinWhen)
    }

    this.info = this._body.info
    const entries = Object.entries(this._body)
    this.givens = entries.filter(([k, v]) => v.isGiven).map(description)
    this.whens = entries.filter(([k, v]) => v.isWhen).map(description)
    builtinWhen()
    this.checks = entries.filter(([k, v]) => v.isCheck).map(description)
  }

  doc() {
    this.build()
    const doc = {
      type: this.type,
      description: this.description,
      info: this.info,
      givens: this.givens.map((given) => given.doc()),
      whens: this.whens.map((when) => when.doc()).filter(Boolean),
      checks: this.checks.map((check) => check.doc())
    }
    return doc
  }

  get isScenario() {
    return true
  }
}

const scenario = (body) => {
  return new Scenario(body)
}

module.exports = { scenario }
