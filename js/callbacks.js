
// Module['ASAN_OPTIONS'] = 'detect_container_overflow=0'
// Module['ASAN_OPTIONS'] = 'detect_stack_use_after_return=1'
Module['CPPCallback'] = function(str) {
      console.log('(worker) CPPCallback received, forwarding it to main');
      j = JSON.parse(str)
      // if (j.fileready === true) {
      //   // get file content and augment json object with it
      //   console.log('(worker) fileready ' + j.filename);
      //   if (j.filename.includes('Error')) {
      //     console.log(
      //         '### reading error file: ' +
      //         '/' + j.filename);
      //     fileAsString =
      //         FS.readFile('/' + j.filename, {'encoding': 'utf8', 'flags': 'r'});
      //     // console.log(fileAsString);
      //   } else {
      //     console.log('(worker) fileready ' + 'FS.mkdir(\'/test\');');
      //     FS.mkdir('/test');
      //     console.log('(worker) fileready ' + 'redind file as string');
      //     fileAsString =
      //         FS.readFile('/' + j.filename);
      //   }
  
      //   console.log('(worker) fileAsString');
      //   // console.log(fileAsString);
      //   j['filecontent'] = fileAsString;
      //   // fileAsArray = FS.readFile(j.filename, {'encoding': 'binary', 'flags':
      //   // 'r'}); j['filecontent'] = fileAsArray;
      //   postMessage(j);
      // }
      // else {postMessage(j)};
      j['cmd'] = "useless";
      postMessage(j)
    };



  Module['onRuntimeInitialized'] = function() {
    // Module['vtswasm'].SetCallback(Module['CPPCallback']);
    // Module['___embind_register_user_types']();
    // Module['vtswasm'].SetCallback(Module['CPPCallback']);
    console.log('(worker) onRuntimeInitialized ready');
    // message = {'runtimeready': true};
    // postMessage(message);
  };
  // Module['abort'] = function(what) {
  //   if (Module['onAbort']) {
  //     Module['onAbort'](what)
  //   }
  //   if (what !== undefined) {
  //     out(what);
  //     err(what);
  //     what = JSON.stringify(what)
  //   } else {
  //     what = ''
  //   }
  //   ABORT = true;
  //   EXITSTATUS = 1;
  //   throw 'abort(' + what + ')';
  // };
