const exec = require('child_process').exec

function execute (cmd, options, cb, stdListener) {
  return new Promise((resolve, reject) => {
    try {
      const child = exec(cmd, options, cb)
      child.on('error', (err) => {
        reject(err)
      })
      child.stderr.on('data', (msg) => {
        stdListener && stdListener(msg)
      })
      child.stdout.on('data', (msg) => {
        stdListener && stdListener(msg)
      })
      child.on('close', (code) => {
        resolve(code)
      })
    } catch (err) {
      console.error('Error: ' + err)
      reject(err)
    }
  })
}

module.exports = execute