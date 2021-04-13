#!/usr/bin/env node

'use strict'

/** @typedef { import('./types').OnMessage } OnMessage */
/** @typedef { import('./types').MidiPort } MidiPort */

const midiPort = require('./midi-port')
const { log } = require('./log')

/** @type { MidiPort } */
let port

const lites = []
for (let row = 1; row <= 8; row++) {
  for (let col = 1; col <= 8; col++) {
    lites.push(10 * row + col)
  }
}

let _nextLiteIndex = -1
function getNextLite() {
  _nextLiteIndex = (_nextLiteIndex + 1) % lites.length
  return lites[_nextLiteIndex]
}

if (require.main === module) main()

async function main() {
  try {
    function onMessage(deltaTime, message) {
      console.log(deltaTime, message)
    }
    
    port = midiPort.createActualMidiPort({ 
      name: 'LP' || 'LPMiniMK3 MIDI',
      onMessage,
    })
  } catch (err) {
    log.exitError(`error opening LaunchPad midi port: ${err}`)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  process.on('SIGBREAK', shutdown)
  setProgrammerMode()

  /** @type { number | undefined } */
  let prevLite
  while (true) {
    // if (prevLite) liteOn(prevLite, 0)
    const nextLite = getNextLite()
    liteOn(nextLite, Math.round(127 * Math.random()))
    prevLite = nextLite

    await delay(500/24)
  }

  shutdown()
}

/** @type {(ms: number) => Promise<void>} */
async function delay(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))

}

// color 0 sets lite off
/** @type { (index: number, color: number) => void } */
function liteOn(index, color) {
  // port.sendMessage([0x90, index, color])

  //                  F0h   00h   20h   29h   02h   0Dh   03h type index color     F7h
  port.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x03, 0,   index, color, 0xF7])

}

function setProgrammerMode() {
  //                     F0h   00h   20h   29h   02h   0Dh  00h <layout> F7h
  // port.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x7F, 0xF7])

  //                  F0h   00h   20h   29h   02h   0Dh   0Eh <mode>  F7h
  port.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x0E, 0x01, 0xF7])
}

function setLiveMode() {
  //                  F0h   00h   20h   29h   02h   0Dh   0Eh <mode>  F7h
  port.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x0E, 0x00, 0xF7])

  //                     F0h   00h   20h   29h   02h   0Dh  00h <layout> F7h
  // port.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x05, 0xF7])
}

function shutdown() {
  console.log('shutting down, resetting Launchpad')
  setLiveMode()
  process.exit()
}