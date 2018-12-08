const clientNodeRequest = (options) => {
    const http = require('http');
    const API_KEY = "84c7afa3103116295887c70f34715049";
    let req = http.request(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=Cher&album=Believe&format=json`,
        {
            agent: new http.Agent({
                keepAlive: true
            })
        }
    );
    // (incomingMessage) => {
    //     console.log("in");
    //     incomingMessage.on('socket', () => {
    //         console.log('socket');
    //     });
    
    //     incomingMessage.on('data', () => {
    //         console.log('data');
    //         incomingMessage.resume();
    //     });
    
    //     incomingMessage.on('close', () => {
    //         console.log('close');
    //     });
    
    //     incomingMessage.on('end', () => {
    //         console.log("ending");
    //     }); 
    // }

    req.on('response', (res) => {
        res.on('data', () => {
            console.log("data");
            res.read();
        });
        res.on('end', () => {
            console.log("end");
        })
        res.on('finish', () => {
            console.log("finish");
        })
        console.log("response");
    });

    req.on("connect", () => {
        console.log("connect")
    });

    req.on("socket", (socket) => {
        console.log("unref");
        socket.unref()
    });

    // req.write("hi");
    req.end();
    req = null;
}

module.exports = clientNodeRequest;
