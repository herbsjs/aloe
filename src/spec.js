const crypto = require('crypto')
const { state } = require('./runningState')

class Spec {
    constructor(body) {
        this.type = 'spec'
        this.state = state.ready
        this._auditTrail = { type: this.type, state: this.state }
        this._body = body
    }

    async run() {
        // if (this._hasRun)
        //     return Err('Cannot run use case more than once. Try to instantiate a new object before run this use case.')
        // this._hasRun = true

        // // audit trail
        // this._auditTrail = this._mainStep._auditTrail
        // this._auditTrail.type = this.type
        // this._auditTrail.description = description
        // this._auditTrail.request = null
        // this._auditTrail.transactionId = crypto.randomUUID()

        this.build()

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
        const description = (entry) => {
            const [description, scenario] = entry
            scenario.description = description
            return scenario
        }
        const addUsecase = (scenario) => {
            if (this.usecase) scenario.usecase = this.usecase
            return scenario
        }
        this.usecase = this._body.usecase
        const entries = Object.entries(this._body)
        this.scenarios = entries
            .filter(([k, v]) => v.isScenario)
            .map(description)
            .map(addUsecase)

        // run flag
        // this._hasRun = false
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

    // get auditTrail() {
    //     return this._mainStep.auditTrail
    // }

    get isSpec() {
        return true
    }
}

const spec = (body) => {
    return new Spec(body)
}

module.exports = { spec }
