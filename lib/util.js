const fs = require("fs")
const path = require("path")
// 检测文件是否存在
exports.checkFileExist = function (pathname) {
    fs.existsSync(path.resolve(process.cwd(), pathname), (isExist) => {
        if (!isExist) {
            return false
        }
        return true
    })
}
