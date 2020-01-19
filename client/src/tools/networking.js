import * as React from 'react';
let base="";//"http://ec2-52-2-196-241.compute-1.amazonaws.com";
function POSTRequest(jsonData,url,action, contentType){
    //alert(base+url);
    if (contentType==null){contentType="text/plain"}
    var sendData = JSON.stringify(jsonData);
    fetch(base+url,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': contentType,//'application/json',
            'Access-Control-Allow-Origin':base
        },
        //mode:'no-cors',
        body: sendData
    })
    .then((response) => {return response.json()})
    .then((responseJson) => {action(responseJson);})//alert(JSON.stringify(responseJson));})
    .catch((error) => {console.error(error);});
}

function uploadFile(fileData,action){
    const data = new FormData();
    data.append('file', fileData);
    data.append('filename', fileData.name);
    fetch(base+'/upload',{
        method: 'POST',
        body: data
    })
    .then((response) => {return response.json()})
    .then((responseJson) => {action(responseJson);})//alert(JSON.stringify(responseJson));})
    .catch((error) => {console.error(error);});
}

function getURL(method){
    var base_url = window.location.origin;
    var host = window.location.host;
    var pathArray = window.location.pathname.split( '/' );
    return base_url+method;
}
export {POSTRequest, uploadFile, getURL};
