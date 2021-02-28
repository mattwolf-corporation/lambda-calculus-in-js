export {HttpGet, HttpGetSync, jokeUrl}

const jokeUrl = "https://api.chucknorris.io/jokes/random";

const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200)
            ? callback(xmlHttp.response)
            : new Error()

    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
}
// Beispiel mit HttpGet asynchronous
// HttpGet(jokeUrl)(true)(x => document.getElementById("joke").innerText = JSON.parse(x).value)

// Beispiel anwendung mit HttpGet asynchronous und Box
// HttpGet(jokeUrl)(true)(resp => Box(resp)(mapf)(JSON.parse)(fold)(x => document.getElementById("joke").innerText = x.value))



const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( );
    return xmlHttp.response;
}

// Beispiel HttpGetSync
// Box(HttpGetSync(jokeUrl))
//      (mapf)(JSON.parse)
//      (fold)(x => x.value)
