
uniqid = require('uniqid');


module.exports = {
    getUniqId: function(){
        return uniqid('user-');
    },
    compile: function(res){
        var spawn = require('child_process').spawn;
        var compile = spawn('gcc', ['test.c']);
        compile.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        compile.stderr.on('data', function (data) {
            return console.log(String(data));
        });
        compile.on('close', function (data) {
            if (data === 0) {
                var run = spawn('./a.out', []);
                run.stdout.on('data', function (output) {
                    console.log(String(output));
                    var fs = require('fs');
                    fs.writeFile("test.txt", String(output), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                    return res.sendfile('test.txt');

                    }); 
                });
                run.stderr.on('data', function (output) {
                    console.log(String(output));
                });
                run.on('close', function (output) {
                    console.log('stdout: ' + output);
                })
            }
        })
    }
  };