// add the requires for the dependencies
const { state } = require("../runningState")
const requireAll = require("./requireAll")
const chalk = require("chalk")
const { congratulations } = require("./congratulations")
const { prettyStack } = require("./prettyStack")

/*
* Runs the specs
*
* @param {object} specs - If provided, no heuristics will be used to load the specs
* @param {object} herbarium - If provided, the specs will be loaded from the herbarium
* @param {string} specsPath - If provided, the specs will be loaded from the file system. The default is the current directory
* @param {object} dependencies - The dependencies to be used
*/
async function runner({ specs, herbarium, specsPath, dependencies = {} }) {
    const undefinedGroup = "(default)"
    const colors = dependencies.colors || {
        grey: chalk.grey,
        green: chalk.green,
        red: chalk.ansi256(160),
        white: chalk.white,
        blue: chalk.blue,
        italic: chalk.italic
    }
    const { grey, green, red, white, italic } = colors
    /* eslint-disable no-console */
    const info = (msg => console.info(msg))
    /* eslint-disable no-console */
    const success = (msg => console.info(chalk.bold.green(msg)))
    const failed = state.failed
    let errorCount = 0
    let successCount = 0

    if (!specs)
        // mode: using herbarium (a full Herbs project)
        if (herbarium)
            // load all the specs from the herbarium
            specs = herbarium.specs.all
        // mode: using Aloe directly
        else {
            // load all the specs from the path
            const reqAll = dependencies.requireAll || requireAll
            specs = reqAll({ initialPath: specsPath })
        }

    function groupSteps(specs) {
        const group = {}
        const description = (usecase) => herbarium?.usecases?.get(usecase)?.usecase()?.description
        specs.forEach(spec => {
            groupName = spec.usecase ? description(spec.usecase) : undefinedGroup
            if (!group[groupName])
                group[groupName] = []
            group[groupName].push(spec)
        })

        // put undefinedGroup at the beginning
        const orderedGroup = {}
        orderedGroup[undefinedGroup] = group[undefinedGroup]
        delete orderedGroup[undefinedGroup]
        Object.assign(orderedGroup, group)

        return orderedGroup
    }


    async function showScenarios(spec, previousGroup, groupName, errorCount, successCount) {
        const ret = await spec.run()
        const color = ret !== failed ? white : red
        if (previousGroup !== groupName) {
            if (groupName === undefinedGroup)
                info(`\n ${color('Scenarios')}`)
            else
                info(`\n ${color(groupName)} ${grey(italic('(Use Case)'))}`)
        }
        previousGroup = groupName

        const result = (ret) => ret !== failed ? green('●') : red('○')

        for (const scenario of spec.scenarios) {

            function countSamples(scenario) {
                let count = 0
                for (const sample of scenario.samples) {
                    count += sample.execution.scenarios.length
                }
                return count
            }

            const samples = countSamples(scenario)
            const hasSamples = samples > 1
            const hasPassed = scenario.state !== failed

            const description = hasSamples ? `(scenario, ${samples} samples)` : '(scenario)'

            info(`   ${result(scenario.state)} ${white(scenario.description)} ${grey(italic(description))}`)
            if (hasPassed) {
                successCount = successCount + samples
                continue
            }

            for (const samples of scenario.samples) {
                ({ errorCount, successCount } = showStepsAndSamples(samples, errorCount, successCount))
            }
        }
        return { previousGroup, errorCount, successCount }
    }

    function showStepsAndSamples(samples, errorCount, successCount) {
        for (const sample of samples.execution.scenarios) {

            function printSteps(step) {
                step.forEach(e => {
                    const description = e.builtin ? `When run` : e.description
                    const color = e.state !== failed ? grey : red
                    const type = `(${e.type})`
                    const result = (ret) => ret !== failed ? green('∘') : red('∘')
                    info(`      ${result(e.state)} ${color(description)} ${grey(italic(type))}`)
                    if (e.error) {
                        errorCount++
                        prettyStack({ error: e.error })
                    }
                })
            }

            function printSample() {
                if (!samples.builtin) {
                    const symbol = '◌'
                    const result = (ret) => ret !== failed ? green(symbol) : red(symbol)
                    info(`\n     ${result(sample.state)} ${white(`${samples.description} ${grey(italic('(sample)'))}:`)}`)
                    info(`\n`)
                    for (const entrie of Object.entries(sample.sample)) {
                        info(`          ${grey('‣')} ${white(`${entrie[0]}:`)} ${grey(`${entrie[1]}`)}`)
                    }
                    info(`\n`)
                }
            }

            printSample()

            printSteps(sample.givens)
            if (sample.stage === 'given') continue
            printSteps(sample.whens)
            if (sample.stage === 'when') continue
            printSteps(sample.checks)
        }
        return { errorCount, successCount }
    }

    const usecasesGroup = groupSteps(specs)

    for (const groupName in usecasesGroup) {

        let previousGroup = null

        for (const specInfo of usecasesGroup[groupName]) {
            ({ previousGroup, errorCount, successCount } = await showScenarios(specInfo.spec, previousGroup, groupName, errorCount, successCount))
        }
    }

    info(chalk.bold(`\n${green('Passing: ')} ${(successCount)}`))

    if (errorCount !== 0) {
        // show the total of not passed scenarios
        info(chalk.bold(`${red('Not passing: ')} ${(errorCount)}\n`))
        process.exit(1)
    }
    else {
        success(`\n  ${(congratulations())} \n`)
    }

}

module.exports = { runner }
