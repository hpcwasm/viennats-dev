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
function terminate(){
    vts.PThread.terminateAllThreads();
    vts = VTS();
}