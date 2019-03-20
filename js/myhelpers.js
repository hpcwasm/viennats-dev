var myreplacer = function(key, val) { return (typeof val === 'function') ? '[function]' : val; }



var myreplacer = function(key, val) { 
    if (key.startsWith("HEAP")  )
    {
      console.log(key)
      console.log('omiitted');
      return 'OMITTED';
    }
    else
    {
      console.log(key)
    return (typeof val === 'function') ? '[function]' : val;
    }
   }
  

// log object including function
console.log(JSON.stringify(Module,myreplacer,2))