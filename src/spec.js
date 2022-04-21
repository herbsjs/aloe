const crypto = require('crypto')
const { state } = require('./runningState')

class Spec {

    constructor(body) {
        this.type = 'spec'
        this.state = state.ready

        //use case
        this.usecase = body.usecase
        delete body.usecase

        // // main step
        // this._mainStep = step(body)
        // this._mainStep.type = this.type
        // this._mainStep.description = description

        // // audit trail
        // this._auditTrail = this._mainStep._auditTrail
        // this._auditTrail.type = this.type
        // this._auditTrail.description = description
        // this._auditTrail.request = null
        // this._auditTrail.transactionId = crypto.randomUUID()

        // run flag
        // this._hasRun = false
    }

    async run() {

        // if (this._hasRun)
        //     return Err('Cannot run use case more than once. Try to instantiate a new object before run this use case.')
        // this._hasRun = true

        return
    }

    // doc() {
    //     const docStep = this._mainStep.doc()
    //     if (this._requestSchema) docStep.request = this._requestSchema
    //     if (this._responseSchema) docStep.response = this._responseSchema
    //     return docStep
    // }

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