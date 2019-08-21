// var workercode = "vtsworker.js"
// var worker = new Worker(workercode);

// function sendmessage(parfilename, numthreads) {
//     // construct message content
//     worker.postMessage(
//         {
//             parfilestring: true,
//             parfile: parfilename,
//             numthreads: numthreads 
//         }
//     );
//   }



// var vts = VTS().then(function() { 
// // register CPP callbacks
// });

// This code is released as public domain -- anyone may use it for any purpose.

function testbug() {
    var bin = new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]);
    var mod = new WebAssembly.Module(bin);
    var inst = new WebAssembly.Instance(mod, {});
  
    // test storing to and loading from a non-zero location via a parameter.
    // Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations
    return (inst.exports.test(4) !== 0);
  }
  
  function log(msg) {
    document.querySelector('#log').textContent = msg;
    console.log(msg);
  }
  
  if (testbug()) {
    // ok, we stored a value.
    log('ok');
  } else {
    log('fail');
  }

var vts;
function initvts(){
    vts = VTS();
}
function startsim(){
    vts.runfileProxy("deposition3D.txt",4)
}
function startsimserial(){
    vts.runfile("deposition3D.txt",4)
}
function debugsim(){
    vts.runfile("trench.txt",1)
}
function terminate(){
    vts.PThread.terminateAllThreads();
    vts = VTS();
}

var fileasstring; 

function getresults() {
    var filename = document.getElementById("filename").value; 
    // console.log(filename);
    fileasstring = vts.FS.readFile(filename, {'encoding': 'utf8', 'flags': 'r'})
    var data = new Blob([fileasstring], {type: 'text/plain'});
    var url = window.URL.createObjectURL(data);
    var link = document.getElementById('resid');
    link.href= url;
    link.setAttribute('download', filename);
    // newWindow = window.open(, 'results.txt');
    // console.log(fileasstring);
    // uriContent = "application/xhtml+xml; charset=UTF-8," + encodeURIComponent(fileasstring);
    // newWindow = window.open(uriContent, 'results.txt');
  }


(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            logger.innerHTML += arguments[i] + '<br />';
        }
      }
      old(...arguments);
    }
})();

(function () {
    var olderr = console.error;
    var loggerer = document.getElementById('loger');
    console.error = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            loggerer.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            loggerer.innerHTML += arguments[i] + '<br />';
        }
      }
      olderr(...arguments);
    }
})();

(function () {
    var oldex= console.exception;
    var loggerex = document.getElementById('logex');
    console.exception = function () {
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'object') {
            loggerex.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
        } else {
            loggerex.innerHTML += arguments[i] + '<br />';
        }
      }
      oldex(...arguments);
    }
})();
