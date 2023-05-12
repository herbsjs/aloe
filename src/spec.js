const crypto = require('crypto')
const { state } = require('./runningState')

class Spec {
    constructor(body) {
        this.type = 'spec'
        this.state = state.ready
        this.ignore = false
        this._auditTrail = { type: this.type, state: this.state }
        this._body = body
    }

    async run() {

        this.build()

        if(this.ignore) {
            this.state = state.ignored
            return this.state
        }

        // scenario
        for (const scenario of this.scenarios) {
            await scenario.run()
        }
        this.state = this.scenarios
            .find((scenario) => scenario.state === state.failed,)
            ? state.failed
            : state.passed

        return this.state
    }

    build() {
        if (this._hasBuild) return
        const addUsecase = (scenario) => {
            if (this.usecase) scenario.usecase = this.usecase
            return scenario
        }
        this.usecase = this._body.usecase
        const entries = Object.entries(this._body)
        const intialized = entries.map(([k, v]) => v.create ? v.create(k) : {})
        this.only = intialized.find((scenario) => scenario.only)
        if (this.only) intialized.forEach((scenario) => {
            if (!scenario.only) scenario.ignore = true
        })

        this.scenarios = intialized
            .filter(s => s.isScenario)
            .map(addUsecase)

        this._hasBuild = true
    }

    doc() {
        this.build()
        const doc = {
            type: this.type,
            scenarios: this.scenarios.map((scenario) => scenario.doc())
        }
        if (this.usecase) doc.usecase = this.usecase().doc()
        return doc
    }

    get isSpec() {
        return true
    }
}

const spec = (body) => {
    return new Spec(body)
}

module.exports = { spec }
