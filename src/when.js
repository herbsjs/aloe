const { state } = require("./runningState")

class When {
    constructor(func) {
      this.type = 'when'
      this.func = func
      this.builtin = false
      this._auditTrail = { type: this.type }
    }

    async run(context) {
      let run = state.ready
      try {
        await this.func(context)
        run = state.done
      } catch (error) {
        run = state.failed
      }
      this.state = run
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

    get isWhen() {
      return true
    }
  }
  
  const when = (body) => {
    return new When(body)
  }
  
  module.exports = { when }
  