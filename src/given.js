const { exec } = require("./exec")
const { state } = require("./runningState")

class Given {
  constructor(description, body) {
    this.type = 'given'
    this.state = state.ready
    this.context = {}
    this.description = description
    this._auditTrail = { type: this.type, state: this.state, description: this.description }
    this._body = body
    if (typeof body === 'function') {
      this.func = body
    }
  }

  async run(context) {
    let run = state.ready
    try {
      const ret = this.func ? await this.func(context) : this._body
      this.context = Object.assign(context, ret)
      // this._auditTrail.context = {... this.context}
      run = state.done
    } catch (error) {
      run = state.failed
      this.error = error
    }
    this.state = run
    this._auditTrail.state = run
    return run
  }

  doc() {
    const doc = {
      type: this.type,
      description: this.description,
      value: exec.safe(this._body),
      isFunction: exec.isFunction(this._body)
    }
    return doc
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    if (this.error) audit.error = this.error
    return audit
  }

  get isGiven() {
    return true
  }
}

const given = (body) => ({
  create: (description) => { return new Given(description, body) }
})

module.exports = { given }
