const backend = 'https://0.0.0.0:8000/';

function send(url, method, data, callback) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    let forFetch = {
        method: method,
        headers: headers
    };
    if(method === 'POST') {
        forFetch.body = JSON.stringify(data);
    } else {
        url = Object.keys(data).reduce((str, param) => {
            return str + param + "=" + data[param] + "&";
        }, url + "?");
    }
    fetch(backend + url, forFetch)
    .then((response) => {
        return response.text();
    })
    .then((text) => {
        const json = JSON.parse(text);
        callback(json);
    })
    .catch((error) => {
        console.log(error);
    })
}

export default send;