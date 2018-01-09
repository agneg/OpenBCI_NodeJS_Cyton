/**
 * This is an example from the readme.md
 * On windows you should run with PowerShell not git bash.
 * Install
 *   [nodejs](https://nodejs.org/en/)
 *
 * To run:
 *   change directory to this file `cd examples/debug`
 *   do `npm install`
 *   then `npm start`
 */
const debug = false; // Pretty print any bytes in and out... it's amazing...
const verbose = true; // Adds verbosity to functions

const Cyton = require('../../openBCICyton');
var ourBoard = new Cyton({
  boardType: 'daisy',
  debug: debug,
  hardSet: true,
  verbose: verbose,
  simulate: true,
  simulatorDaisyModuleAttached: true,
  simulatorSampleRate: 125
});

ourBoard.on('error', (err) => {
  console.log(err);
});

ourBoard.autoFindOpenBCIBoard().then(portName => {
  if (portName) {
    /**
     * Connect to the board with portName
     * Only works if one board is plugged in
     * i.e. ourBoard.connect(portName).....
     */
    ourBoard.connect(portName) // Port name is a serial port name, see `.listPorts()`
      .then(() => {
        ourBoard.once('ready', () => {
          ourBoard.streamStart();
          ourBoard.impedanceTestAllChannels();
          ourBoard.on('impedanceArray', impedanceArray => {
            console.log(impedanceArray);
            ourBoard.impedanceTestAllChannels();
          });
        });
      });
  } else {
    /** Unable to auto find OpenBCI board */
    console.log('Unable to auto find OpenBCI board');
  }
});

function exitHandler (options, err) {
  if (options.cleanup) {
    if (verbose) console.log('clean');
    ourBoard.removeAllListeners();
    /** Do additional clean up here */
  }
  if (err) console.log(err.stack);
  if (options.exit) {
    if (verbose) console.log('exit');
    ourBoard.disconnect().catch(console.log);
  }
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {
  cleanup: true
}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
  exit: true
}));
