#!/usr/bin/env node
// const path = require('path')
// const exec = require('child_process').execSync
// exec('yarn add vue-loader')
const configPath = process.argv[2]
if (process.env.NODE_ENV === 'development') {
//   loadDependency(configPath).then(() => {
  require('../lib/server')(configPath)
//   })
} else if (process.env.NODE_ENV === 'production') {
//   loadDependency(configPath).then(() => {
  require('../lib/build')(configPath)
//   })
} else {
  throw new Error('NODE_ENV 必须设置为 development | production')
}

// async function loadDependency (configRelactivePath) {
//   const { config = {} } = path.resolve(
//     process.cwd(),
//     configRelactivePath || './serein.config.js'
//   )
//   // vue 框架
//   if (config.framework === 'vue') {
//     exec('yarn add vue@2.6.12 vue-template-compiler vue-loader')
//     // 默认react框架
//   } else {
//     exec('yarn add react react-dom')
//   }

//   if (config.ts) {
//     exec('yarn add ts-loader typescript')
//     if (!config.framework || config.framework === 'react') {
//       exec('yarn add @types/react @types/react-dom')
//     }
//   }

//   if (config.css) {
//     function switchCss (name) {
//       switch (name) {
//         case 'less':
//           exec('yarn add less less-loader')
//           break
//         case 'scss':
//           exec('yarn add node-sass sass-loader')
//           break
//         default:
//           break
//       }
//     }
//     if (typeof config.css === 'string') {
//       switchCss(config.css)
//     } else if (Array.isArray(config.css)) {
//       config.css.forEach((name) => {
//         switchCss(name)
//       })
//     } else {
//       throw new Error('请输入正确数据格式')
//     }
//   }
// }
