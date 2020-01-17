import * as React from 'react';
let base="";//"http://ec2-52-2-196-241.compute-1.amazonaws.com";
function POSTRequest(jsonData,url,action){
    //alert(base+url);
    var sendData = JSON.stringify(jsonData);
    fetch(base+url,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'text/plain',//'application/json',
            'Access-Control-Allow-Origin':base
        },
        //mode:'no-cors',
        body: sendData
    })
    .then((response) => {console.log(response);return response.json()})
    .then((responseJson) => {action(responseJson);})//alert(JSON.stringify(responseJson));})
    .catch((error) => {console.error(error);});
}

export {POSTRequest};
