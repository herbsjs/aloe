const { builtinWhen } = require('./builtin/when')
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

    const exec = async (list, context) => {
      for (const item of list) {
        await item.run(context)
      }
      this.state = list.find((check) => check.state === state.failed) ? state.failed : state.passed
      this._auditTrail.state = this.state
      return this.state
    }

    let ret
    ret = await exec(this.givens)
    if (ret === state.failed) return ret

    // context
    this.context = this.givens
      .map((given) => given.context)
      .reduce((prev, current) => Object.assign(prev, current))
    if (this.usecase) this.context.usecase = this.usecase
    
    ret = await exec(this.whens, this.context)
    if (ret === state.failed) return ret

    ret = await exec(this.checks, this.context)
    return ret
  }

  build() {
    const description = (entries) => {
      const [description, instance] = entries
      instance.description = description
      return instance
    }
    const addBuiltinWhen = () => {
      if (!this.usecase) return
      if (this.whens.length > 0) return
      const when = builtinWhen()
      this.whens.push(when)
    }

    this.info = this._body.info
    const entries = Object.entries(this._body)
    this.givens = entries.filter(([k, v]) => v.isGiven).map(description)
    this.whens = entries.filter(([k, v]) => v.isWhen).map(description)
    addBuiltinWhen()
    this.checks = entries.filter(([k, v]) => v.isCheck).map(description)
  }

  doc() {
    this.build()
    const doc = {
      type: this.type,
      description: this.description,
      info: this.info,
      givens: this.givens.map(given => given.doc()),
      whens: this.whens.map(when => when.doc()).filter(Boolean),
      checks: this.checks.map(check => check.doc())
    }
    return doc
  }

  get auditTrail() {
    const audit = {... this._auditTrail}
    audit.description = this.description
    audit.givens = this.givens.map(given => given.auditTrail)
    audit.whens = this.whens.map(when => when.auditTrail)
    audit.checks = this.checks.map(check => check.auditTrail)
    return audit
  }

  get isScenario() {
    return true
  }
}

const scenario = (body) => {
  return new Scenario(body)
}

module.exports = { scenario }
