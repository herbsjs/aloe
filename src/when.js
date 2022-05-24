const { state } = require("./runningState")

class When {
  constructor(func) {
    this.type = 'when'
    this.func = func
    this.builtin = false
    this.state = state.ready
    this._auditTrail = { type: this.type, state: this.state }
  }

  async run(context) {
    let run = state.ready
    try {
      await this.func(context)
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
    if (this.builtin) return
    const doc = {
      type: this.type,
      description: this.description
    }
    return doc
  }

  get auditTrail() {
    const audit = {... this._auditTrail}
    if (this.error) audit.error = this.error
    audit.description = this.description
    return audit
  }

  get isWhen() {
    return true
  }
}

const when = (body) => {
  return new When(body)
}

module.exports = { when }
