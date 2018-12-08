var Wreck = require('wreck');
const Http = require('http');
const Https = require('https');

const call = (url) => {

    const wreck = Wreck.defaults({
        agents: {
            https: new Https.Agent({ keepAlive: true }),
            http: new Http.Agent({ keepAlive: true }),
            httpsAllowUnauthorized: new Https.Agent({ maxSockets: 100, rejectUnauthorized: false })
        }
    });

    const prom = wreck.get('', { baseUrl: url });
    prom.then(({res}) => {

        res.on('data', () => {
            console.log("data");
        });
        
        // res.on('response', () => {
        //     console.log("response");
        // });

        res.on('end', () => {
            console.log("ending");
        });

    }).finally(() => {
        console.log("hi");
    });
}

module.exports = call;
