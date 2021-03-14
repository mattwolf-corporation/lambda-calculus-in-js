export {HttpGet, HttpGetSync}


const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState > 1 && xmlHttp.readyState < 4)
            ? (xmlHttp.status < 200 || xmlHttp.status >= 300)                            ? xmlHttp.abort()                : () => console.log("not readystate: " + xmlHttp.readyState)
            : (xmlHttp.readyState === 4 && xmlHttp.status >= 200 && xmlHttp.status <300) ? callback(xmlHttp.responseText) : () => console.error("error fetch data")


    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30 * 1000;                     //30 seconds
    xmlHttp.ontimeout = () => console.error("timeout after 30 seconds");
    xmlHttp.send();
}

// const HttpGet = url => {
//     const xmlHttp = new XMLHttpRequest();
//     // xmlHttp.onreadystatechange = () =>
//     //     (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200)
//     //         ? callback(xmlHttp.responseText)
//     //         : new Error()
//
//     xmlHttp.open("GET", url, true); // true for asynchronous
//     xmlHttp.send();
//     return xmlHttp
// }

// Beispiel mit HttpGet asynchronous
// HttpGet(jokeUrl)(true)(x => document.getElementById("joke").innerText = JSON.parse(x).value)

// Beispiel anwendung mit HttpGet asynchronous und Box
// HttpGet(jokeUrl)(true)(resp => Box(resp)(mapf)(JSON.parse)(fold)(x => document.getElementById("joke").innerText = x.value))



const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( );
    return xmlHttp.responseText;
}


const HttpPostSync = body => url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, false );
    xmlHttp.send(body);
    return xmlHttp;
}

// Beispiel HttpGetSync
// Box(HttpGetSync(jokeUrl))
//      (mapf)(JSON.parse)
//      (fold)(x => x.value)

