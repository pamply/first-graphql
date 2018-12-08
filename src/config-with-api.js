const API_KEY = "84c7afa3103116295887c70f34715049";

const urlWithApi = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=Cher&album=Believe&format=json`;

module.exports = urlWithApi;
