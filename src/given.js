const { exec } = require("./exec")
const { state } = require("./runningState")

class Given {
  constructor(body) {
    this.type = 'given'
    this.state = state.ready
    this.context = {}
    this._auditTrail = { type: this.type, state: this.state }
    this._body = body
    if (typeof body === 'function') {
      this.func = body
    }
  }

  async run() {
    let run = state.ready
    try {
      const ret = this.func ? await this.func() : this._body
      this.context = Object.assign({}, ret)
      run = state.done
    } catch (error) {
      run = state.failed
    }
    this.state = run
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

  get isGiven() {
    return true
  }
}

const given = (body) => {
  return new Given(body)
}

module.exports = { given }
