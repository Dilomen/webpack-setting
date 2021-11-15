function transferArgs (args) {
  const Len = args.length
  const argsObj = {}
  for (let i = 0; i < Len; i++) {
    if (/^-\S/.test(args[i])) {
      argsObj[args[i]] = args[i + 1] || ''
      ++i
    }
  }
  return argsObj
}

module.exports = transferArgs