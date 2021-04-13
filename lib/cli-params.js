'use strict'

/** @typedef { import('./types').CliParams } CliParams */

const minimist = require('minimist')
const pkg = require('../package.json')
const { log } = require('./log')

module.exports = {
  getCliParams,
}

const DEFAULT_PORT = '3456'

const minimistOpts = {
  boolean: ['help', 'version' ],
  alias: {
    h: 'help',
    v: 'version',
  },
}

/** @type { (argv?: string[]) => CliParams } */
function getCliParams(argv) {
  if (!argv) argv = process.argv.slice(2)
  const args = minimist(argv, minimistOpts)

  if (args.help) help()
  if (args.version) version()

  const [ aMidiDevice, vMidiDevice, ...rest ] = args._
  if (!aMidiDevice) help()

  if (rest.length !== 0) {
    log(`extraneous parameters ignored: ${JSON.stringify(rest)}`)
  }

  return { aMidiDevice, vMidiDevice }
}

function version() {
  console.log(pkg.version)
  process.exit(1)
}

function help() {
  console.log(`
${pkg.name} v${pkg.version}

~ under development ~

usage:
    ${pkg.name} lp-key seq-name

where:
    lp-key     is a string in the midi port to match for the launchpad
    seq-name   is the name of the midi port to create for the sequencer

options:
    -p --port          port to use for the http server
    -l --list          list available midi ports
    -h --help          print this help
    -v --version       print program version

If no parameters are provided, this help will be printed.

The DEBUG environment variable can be set to anything for debug logging.

For more information, go to ${pkg.homepage}
`.trim())
  process.exit(1)
}

