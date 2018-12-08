const http = require('http');

const API_KEY = "84c7afa3103116295887c70f34715049";

const options = {
    hostname: "ws.audioscrobbler.com",
    path: `/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=Cher&album=Believe&format=json`
};
    
const keepAliveAgent = new http.Agent({
    keepAlive: true
});

options.agent = keepAliveAgent;

module.exports =  options;
