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
    }
    this.state = run
    return run
  }

  get isCheck() {
    return true
  }
}

const check = (body) => {
  return new Check(body)
}

module.exports = { check }
