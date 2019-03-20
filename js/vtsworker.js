
var Module = {
  'print': function(text) {
    message = {'stdout': true, 'text': text};
    postMessage(message);
  },
  'printErr': function(text) {
    message = {'stderr': true, 'text': text};
    postMessage(message);
  },
  CPPCallback: function(str) {
    console.log('(worker) CPPCallback received, forwarding it to main');
    j = JSON.parse(str)
    if (j.fileready === true) {
      // get file content and augment json object with it
      console.log('(worker) fileready');
      fileAsString =
          FS.readFile(j.filename, {'encoding': 'utf8', 'flags': 'r'});
      console.log('(worker) fileAsString');
      // console.log(fileAsString);
      j['filecontent'] = fileAsString;
      // fileAsArray = FS.readFile(j.filename, {'encoding': 'binary', 'flags':
      // 'r'}); j['filecontent'] = fileAsArray;
      postMessage(j);
    }
    else {postMessage(j)};
  },
  onRuntimeInitialized: function() {
    Module.vtswasm.SetCallback(Module.CPPCallback);
    console.log('(worker) onRuntimeInitialized ready');
    message = {'runtimeready': true};
    postMessage(message);
  }

};

importScripts('viennats.js');

// message from GUI
onmessage =
    function(e) {
  console.log('(worker) message received from main');
  if (e.data.parfile !== undefined) {
    console.log('(worker) runsim' + e.data.parfile);
    Module.runfile(e.data.parfile);
  } else if (e.data.parfilestring !== undefined) {
    console.log('(worker) runsim from parfilestring' + e.data.parfilestring);
    console.log('(worker) runsim from parfilestring');
    FS.writeFile('/mysim.txt', e.data.parfilestring);
    try {
      Module.runfile('/mysim.txt');
    } catch (err) {
      message = {'runtimeexception': true};
      postMessage(message);
    }
  } else if (e.data.terminate !== undefined) {
    console.log('(worker) terminating myself');
    self.close();
  } else {
    console.log('(worker) cannot identify message from worker');
  }
}


// post load