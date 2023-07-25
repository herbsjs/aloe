const chalk = require('chalk')

const themes = {
    "herbs": {
        "main": 223,
        "message": 220,
        "backgroundMessage": 236,
        "projectFile": 245,
        "nonProjectFile": 240
    }
}

function prettyStack({ error, theme = themes.herbs }) {

    if (!(error instanceof Error)) {
        console.log(`\n       `, chalk.ansi256(theme['main'])('Error:'), chalk.ansi256(theme['message'])(chalk.bgAnsi256(theme['backgroundMessage'])(error)), `\n`)
        return
    }

    // Replace the error message with a colorized version
    let messageStack = error.stack.replace(error.message, chalk.ansi256(theme['message'])(chalk.bgAnsi256(theme['backgroundMessage'])(error.message)))

    // Get the stack trace information and split it into an array of lines
    const stackTrace = messageStack.split('\n')

    // Create a regular expression to match the file path and line number information
    const regex = /(\s+at\s+.+)\s+\((.+):(\d+):(\d+)\)/

    // Get the root directory of the project
    const projectRoot = process.cwd()

    // Iterate over each line in the stack trace and format it with chalk
    const formattedStackTrace = stackTrace.map(line => {
        const matches = line.match(regex)
        if (matches) {
            const [_, functionCall, filePath, lineNumber, columnNumber] = matches
            const isProjectFile = filePath.startsWith(projectRoot) && !filePath.includes('node_modules')
            let formattedFilePath = filePath
            if (isProjectFile) {
                const projectPath = filePath.replace(projectRoot, '')
                const formatedProjectRoot = chalk.ansi256(theme['nonProjectFile'])(projectRoot)
                const formattedProjectPath = chalk.ansi256(theme['projectFile'])(projectPath)
                formattedFilePath = `${formatedProjectRoot}${formattedProjectPath}`
            }
            const formattedLine = chalk.ansi256(theme['nonProjectFile'])(`${formattedFilePath}:${lineNumber}:${columnNumber}`)
            return `${chalk.ansi256(theme['main'])(`        ${functionCall} ${formattedLine}`)}`
        } else {
            return chalk.ansi256(theme['main'])(`        ${line}`)
        }
    }).join('\n')

    /* eslint-disable no-console */
    console.info(`\n${formattedStackTrace}\n`)
}

module.exports = { prettyStack }
