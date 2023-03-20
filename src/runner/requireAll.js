const path = require('path')
const reqAll = require('require-all')
const fs = require('fs')

function requireAllIfExist(options) {
    if (!fs.existsSync(options.dirname)) return
    return reqAll(options)
}

module.exports = function requireAll(options = {}) {
    const initialPath = options.initialPath || process.cwd()
    const __dir = initialPath.split(path.sep).join(path.posix.sep)

    const fileFilter = options.fileFilter ||
        ((fileName) => (fileName.includes('.spec.js') ? fileName : false))

    const filesReqAll = new Map()
    let files

    const excludeDirs = options.excludeDirs || ['node_modules']

    // specs
    files = requireAllIfExist({ dirname: __dir, filter: fileFilter, excludeDirs })

    function convertToMap(obj, map) {
        for (let key in obj) {
            if (key.includes('.spec.js')) {
                map.set(key, { spec: obj[key] })
            }
            else {
                if (typeof obj[key] === 'object') {
                    convertToMap(obj[key], map)
                }
            }
        }
    }

    convertToMap(files, filesReqAll)

    return filesReqAll
}

