import { useState, useParams } from 'react';
import * as React from "react";
import './App.css';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';

import Login from './pages/Login.js';
import {Top, Group, ShowInfo, TabbedLayout} from './layout.js';

import { Provider, connect } from 'react-redux'
import {linkStore, store} from './globalState.js';

import {POSTRequest} from './tools/networking.js';

import {Home} from './pages/Dashboard.js';
import {TaskView} from './pages/TaskView.js';
import {TaskList} from './pages/TasksList.js';
import {AddTask} from './pages/AddTask.js';
import {Mentoring} from './pages/Mentoring.js';
import {EditTask} from './pages/TaskEdit.js';
import {UserSettings} from './pages/UserSettings.js';
//////////////////////////////////////////////////////////////////////


//Home = connect(mapStateToProps)(Home);
function RetrieveFile(props){
    let bucket = props.match.params.bucket;
    let name = props.match.params.name;
    //alert(directory);
    fetch("/static/"+bucket+"/"+name)
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.getElementById('redownload');
        a.href = url;
        a.download = name;
        a.click();    
        //a.remove();  //afterwards we remove the element again         
    });
    return <div style={{margin:"auto", margin:"1em"}}>
        <h1>Downloading</h1>
        <p>You should download {name} soon. Click <a id="redownload">Here</a> to download if it doesnt download within 5 seconds.</p>
        
    </div>;
}

function ContactUs(){
    return (<div>
    <Top/>
    
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSe0WpgILg8vXrOpCqgHfZunji-SzkKlr_qNtmri67AAbk3uew/viewform?embedded=true" 
    style={{margin:"auto",width:"100%", height:"90vh"}}>Loading…</iframe>
    </div>);
}
//https://reacttraining.com/react-router/web/guides/quick-start
function App(props){
    return (
    <Provider store={store}>

    <div>
      
    <Router>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/task/:id" component={TaskView}/>
          <Route path="/static/:bucket/:name" component={RetrieveFile}/>
          <Route path="/edit/:id" component={EditTask}/>
          <Route path="/tasklist">
            <TaskList/>
          </Route>
          
          <Route path="/suggest">
            <Top/>
            <br></br>
            <h2>  Under Construction</h2>
          </Route>
          <Route path="/addtask">
            <AddTask/>
          </Route>
          <Route path="/mentoring">
            <Mentoring/>
          </Route>
          <Route path="/usersettings">
            <UserSettings/>
          </Route>
          <Route path="/contactus">
            <ContactUs/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
    </Router>
    </div>
    </Provider>
    );
}
export default App;
