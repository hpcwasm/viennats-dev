if (ENVIRONMENT_IS_WORKER)
{
Module['print'] = function (text) {
    var message = { 'stdout': true, 'text': text };
    postMessage(message);
};
Module['printErr'] = function (text) {
    var message = { 'stderr': true, 'text': text };
    postMessage(message);
};
} else 
{
    
}
Module['CPPCallback'] = function (str) {
    console.log('(worker) CPPCallback received, forwarding it to main');
    var j = JSON.parse(str)
    if (j.fileready === true) {
        // get file content and augment json object with it
        console.log('(worker) fileready ' + j.filename);
        if (j.filename.includes('Error')) {
            console.log(
                '### reading error file: ' +
                '/' + j.filename);
                var fileAsString =
                FS.readFile('/' + j.filename, { 'encoding': 'utf8', 'flags': 'r' });
            // console.log(fileAsString);
        } else {
            var fileAsString =
                FS.readFile(j.filename, { 'encoding': 'utf8', 'flags': 'r' });
        }

        console.log('(worker) fileAsString');
        // console.log(fileAsString);
        j['filecontent'] = fileAsString;
        // fileAsArray = FS.readFile(j.filename, {'encoding': 'binary', 'flags':
        // 'r'}); j['filecontent'] = fileAsArray;
        postMessage(j);
    }
    else { postMessage(j) };
};
Module['onRuntimeInitialized'] = function () {
    // copied from
    Module.abort = function (what) {
        if (Module['onAbort']) {
            Module['onAbort'](what)
        }
        if (what !== undefined) {
            out(what);
            err(what);
            what = JSON.stringify(what)
        } else {
            what = ''
        }
        ABORT = true;
        EXITSTATUS = 1;
        throw 'abort(' + what + ')';
    };
    Module.vtswasm.SetCallback(Module.CPPCallback);
    console.log('(worker) onRuntimeInitialized ready');
    var message = { 'runtimeready': true };
    postMessage(message);
};
Module['locateFile'] = function (url) { 

    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if  (http.status!=404){
        return url;
    }
    else {
        return '../buildwasm/' + url;
    }
    
 };
