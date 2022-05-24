const { exec } = require("./exec")
const { state } = require("./runningState")

class Check {
  constructor(func) {
    this.type = 'check'
    this.func = func
    this.state = state.ready
    this._auditTrail = { type: this.type, state: this.state }
  }

  async run(context) {
    let run = state.ready
    try {
      await this.func(context)
      run = state.passed
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
      description: this.description
    }
    return doc
  }

  get auditTrail() {
    const audit = { ... this._auditTrail }
    if (this.error) audit.error = this.error
    audit.description = this.description
    return audit
  }

  get isCheck() {
    return true
  }

}

const check = (body) => {
  return new Check(body)
}

module.exports = { check }
