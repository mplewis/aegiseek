module.exports = {
  reporters: ['default', ['jest-junit', { output: 'junit/results.xml' }]],
  collectCoverageFrom: ['src/**/*.js'],
  setupTestFrameworkScriptFile: 'bdd-lazy-var/getter'
}
