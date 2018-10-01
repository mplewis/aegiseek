const forever = require('forever-monitor')

const child = new forever.Monitor('src/main.js')
child.start()
