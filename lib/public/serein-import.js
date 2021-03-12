const healperImport = require('@babel/helper-module-imports')
const { getLibAbsPath } = require('../util')

class ImportPlugin {
  constructor (libraryGroup) {
    this.libraryGroup = libraryGroup
    this.willImportMap = {}
    this.importedMap = {}
  }

  getWillImportMap (key) {
    return this.willImportMap[key]
  }

  setWillImportMap (key, value) {
    this.willImportMap[key] = value
  }

  getImportedMap (key) {
    return this.importedMap[key]
  }

  setImportedMap (key, value) {
    this.importedMap[key] = value
  }

  importMethod (path, file) {
    for (const prop in this.willImportMap) {
      if (this.getWillImportMap(prop)) {
        // 首字母大写
        let moduleName = ''
        if (prop === 'ReactDOM') {
          moduleName = 'react-dom'
        } else {
          moduleName = prop.charAt(0).toLowerCase() + prop.slice(1)
        }
        const importPath = getLibAbsPath(__dirname, `../../node_modules/${moduleName}`)
        // addDefault(path, 资源路径, { nameHint: "组件名" }) -> import 组件名 from "资源路径"
        const imported = healperImport.addDefault(
          file.path,
          `${importPath}`,
          { nameHint: prop }
        )
        // addSideEffect(path, 资源路径) -> import "资源路径"
        this.setImportedMap(prop, imported)
        delete this.willImportMap[prop]
        return imported
      }
    }
  }
}

let importPlugin = null
module.exports = function ({ types }) {
  return {
    visitor: {
      // Program钩子函数主要接收webpack的配置
      Program: {
        enter (path, { opts = {} }) {
          importPlugin = new ImportPlugin(
            opts.libraryGroup
          )
        }
      },
      // ImportDeclaration钩子函数主要处理import之类的源码
      ImportDeclaration: {
        enter (path, state) {
          const {
            node,
            hub: { file }
          } = path
          if (!node) return
          // value 导入模块的来源（String） specifiers 引入的模块（Node） {Button, Text} -> [Node {...Button}, Node {...Text}]
          const { source: { value } = {}, specifiers = [] } = node
          if (importPlugin.libraryGroup.includes(value)) {
            specifiers.forEach((spec) => {
              importPlugin.setWillImportMap(spec.local.name, spec.local.name)
            })
            // 移除原先的模块导入
            path.remove()
            // 添加新的模块导入
            importPlugin.importMethod(path, file)
          }
        }
      },
      // 所有的标识符
      Identifier (path) {
        const value = importPlugin.getImportedMap(path.node.name)
        // hasOwnProperty主要是防止对象下的原生属性，如__proto__默认值为{}
        if (value && Object.prototype.hasOwnProperty.call(importPlugin.importedMap, path.node.name)) {
          // 替换代码中的组件引用
          path.replaceWith(value)
        }
      }
    }
  }
}
