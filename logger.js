'use strict'; 
// Multi Instance Logger object: 
// args:
// output can be out/undefined (for console.log), err(for console.error), path(for logging in a file)
// priorityMode is the minimum level of priority of displayed your messages in the log (Logger.INFO, Logger.WARNING, Logger.ERROR).
function Logger(output,priorityMode){
    this.priorityMode = (typeof priorityMode === 'undefined') ? Logger.ERROR : priorityMode;    
    this['write'] = this._writeInOut; 
    if ((typeof output !== 'undefined')&&(output != 'out')){
        this['write'] = this._writeInFile;
        this.stream =  new require('fs').WriteStream(output,{flag: 'a',encoding:'utf8',});
        this.stream.on('error',this.defaultFallback.bind(this));
    }
}
// priorities
Logger.INFO = 0; 
Logger.WARNING = 1; 
Logger.ERROR = 2;

Logger.prototype = {
    _writeInFile: function(message,code,priority){
        if((typeof priority === 'undefined') || priority >= this.priorityMode)
            this.stream.write(
                '['+(new Date().toUTCString())+'] '+((typeof priority === 'undefined')?'':(priority==0?'[INFO]':(priority==1?'[WARNING]':(priority==2?'[ERROR]':'[??]'))))+((typeof code === 'undefined')?'':' Code '+code+': ')+message
            +'\n');
    },
    _writeInOut: function(message,code,priority){
        if((typeof priority === 'undefined') || priority >= this.priorityMode)
            console.log(
                '['+(new Date().toUTCString())+'] '+((typeof priority === 'undefined')?'':(priority==0?'[INFO]':(priority==1?'[WARNING]':(priority==2?'[ERROR]':'[??]'))))+((typeof code === 'undefined')?'':' Code '+code+': ')+message
            );
    },
    timeFct: function(fct,context,fctName){ // Timing a function call
        var time = process.hrtime();
        fct.apply(context,Array.prototype.slice.call(arguments, 3));
        var diff = process.hrtime(time);
        this.write('Call of '+fctName+' in '+((diff[0] * 1e9 + diff[1])/1000)+'μs');
    },
    close: function(){ // Closing the file Logger
        if(typeof this.stream !== 'undefined') this.stream.close(); 
    },
    defaultFallback: function(){ // Callback to fallback to stdout if file doesn't open
        this['write'] = this._writeInOut;
        console.log("File descriprion couldn't be open for writing, defaulting on standard output");
    },
};

// Export for node (CommonJS)
module.exports = Logger; 
