const clientNodeGet = (options) => {
    const http = require('http');

    const callback = (res) => { 
        res.on('close', () => {
            console.log('close');
        });

        // res.on('socket', () => {
        //     console.log('socket');
        // });

        // res.on('timeout', () => {
        //     console.log('socket');
        // });

        res.on('aborted', () => {
            console.log('aborted');
        })

        res.on('error', () => {
            console.log('error')
        })

        res.on('data', () => {
            console.log('data');
            // res.resume();
        });

        res.on('end', () => {
            console.log("ending");
        });
    };

    http.get(options, callback);
}


module.exports = clientNodeGet;
