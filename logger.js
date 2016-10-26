'use strict'; 
// Multi Instance Logger object: 
// args:
// output can be out/undefined (for console.log), err(for console.error), path(for logging in a file)
// priorityMode is the minimum level of priority of displayed your messages in the log (Logger.INFO, Logger.WARNING, Logger.ERROR).
class Logger{
    constructor(output, priorityMode){
        
        this.priorityMode = (typeof priorityMode === 'undefined') ? Logger.ERROR : priorityMode;    
        this.write = this._writeInOut.bind(this); 
        if(output && (output != 'out')){
            this.write = this._writeInFile.bind(this);
            this.stream =  new require('fs').WriteStream(output,{flag: 'a',encoding:'utf8',});
            this.stream.on('error',this.defaultFallback.bind(this));
        }
    }
    _writeInFile(message, code, priority){
        if(!priority || priority >= this.priorityMode)
            this.stream.write(
                '['+(new Date().toUTCString())+'] '+(priority?'':(priority == Logger.INFO?'[INFO]':(priority == Logger.WARNING?'[WARNING]':(priority == Logger.ERROR?'[ERROR]':'[??]'))))+((typeof code === 'undefined')?'':' Code '+code+': ')+message
            +'\n');
    }
    _writeInOut(message, code, priority){
        if(!priority || priority >= this.priorityMode)
            console.log(
                '['+(new Date().toUTCString())+'] '+(priority?'':(priority == Logger.INFO?'[INFO]':(priority == Logger.WARNING?'[WARNING]':(priority == Logger.ERROR?'[ERROR]':'[??]'))))+((typeof code === 'undefined')?'':' Code '+code+': ')+message
            );
    }
    close(){ 
        if(this.stream) this.stream.close(); 
    }
    defaultFallback(){ // Callback to fallback to stdout if file doesn't open
        this.write = this._writeInOut.bind(this);
        console.log("File descriprion couldn't be open for writing, defaulting on standard output");
    },
}
// priorities
Logger.INFO = 0; 
Logger.WARNING = 1; 
Logger.ERROR = 2;

// Export for node (CommonJS)
module.exports = Logger; 
