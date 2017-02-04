'use strict'; 
/*jshint esversion: 6 */
/*jshint node: true */
/* globals __base */
/* globals __chatsessions */
/* globals __flows */
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
    _writeInFile(message, priority, code){
        if(!priority || priority >= this.priorityMode)
            this.stream.write(
                '['+(new Date().toISOString())+'] '+(priority !== undefined ?(priority == Logger.DEBUG?'DEBUG ':(priority == Logger.INFO?'INFO ':(priority == Logger.WARNING?'WARN ':(priority == Logger.ERROR?'ERROR ':'?? ')))):'?? ')+(!code?'':'Code '+code+': ')+message
            +'\n');
    }
    _writeInOut(message, priority, code){
        if(!priority || priority >= this.priorityMode)
            console.log(
                '['+(new Date().toISOString())+'] '+(priority !== undefined ?(priority == Logger.DEBUG?'DEBUG ':(priority == Logger.INFO?'INFO ':(priority == Logger.WARNING?'WARN ':(priority == Logger.ERROR?'ERROR ':'?? ')))):'?? ')+(!code?'':'Code '+code+': ')+message
            );
    }
    close(){ 
        if(this.stream) this.stream.close(); 
    }
    defaultFallback(){ // Callback to fallback to stdout if file doesn't open
        this.write = this._writeInOut.bind(this);
        console.log("File descriprion couldn't be open for writing, defaulting on standard output");
    }
}
// priorities
Logger.DEBUG = 0; 
Logger.INFO = 1; 
Logger.WARNING = 2;
Logger.ERROR = 3;

// Export for node (CommonJS)
module.exports = Logger; 
