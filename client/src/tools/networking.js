import * as React from 'react';
function POSTRequest(jsonData,url,action){
    var sendData = JSON.stringify(jsonData);
    fetch(url,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: sendData
    })
    .then((response) => response.json())
    .then(action).catch((error) => {console.error(error);});
}

export {POSTRequest};
