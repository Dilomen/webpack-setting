const { addDefault, addNamed } = require('@babel/helper-module-imports')
const { getLibAbsPath } = require('../utils')

class ImportPlugin {
  constructor(libraryGroup) {
    this.libraryGroup = libraryGroup
    this.willImportMap = {}
    this.importedMap = {}
  }

  getWillImportMap (key) {
    return this.willImportMap[key]
  }

  /**
   * @param {*} key 
   * @param {Object} value
   *  importType 导入方式
   *  moduleName 导入包名称
   */
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
        const {importType, moduleName} = this.willImportMap[prop]
        if (!importType || !moduleName) return
        const importPath = getLibAbsPath(__dirname, `../../node_modules/${moduleName}`)
        // addDefault(path, 资源路径, { nameHint: "组件名" }) -> import 组件名 from "资源路径"
        let imported = null;
        if (importType === 'ImportDefaultSpecifier') {
          imported = addDefault(
            file.path,
            `${importPath}`,
            { nameHint: prop }
          )
        } else if (importType === 'ImportSpecifier') {
          imported = addNamed(
            file.path,
            prop,
            `${importPath}`,
          )
        }
        this.setImportedMap(prop, imported)
        delete this.willImportMap[prop]
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
              importPlugin.setWillImportMap(spec.local.name, { importType: spec.type, moduleName: value })
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
        let nodeName = path.node.name
        const value = importPlugin.getImportedMap(nodeName)
        // hasOwnProperty主要是防止对象下的原生属性，如__proto__默认值为{}
        if (value && Object.prototype.hasOwnProperty.call(importPlugin.importedMap, nodeName) && path.isReferencedIdentifier()) {
          // 替换代码中的组件引用
          path.replaceWith(value)
        }
      },
    }
  }
}
