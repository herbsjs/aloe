const { state } = require('./runningState')

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

    // given - context
    this.context = this.givens
      .map((given) => given.context)
      .reduce((prev, current) => Object.assign(prev, current))

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
    function description(entries) {
      const [description, instance] = entries
      instance.description = description
      return instance
    }
    this.info = this._body.info
    const entries = Object.entries(this._body)
    this.givens = entries.filter(([k, v]) => v.isGiven).map(description)
    this.whens = entries.filter(([k, v]) => v.isWhen).map(description)
    this.checks = entries.filter(([k, v]) => v.isCheck).map(description)
  }

  get isScenario() {
    return true
  }
}

const scenario = (body) => {
  return new Scenario(body)
}

module.exports = { scenario }
