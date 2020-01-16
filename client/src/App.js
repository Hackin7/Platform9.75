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
//////////////////////////////////////////////////////////////////////


//Home = connect(mapStateToProps)(Home);


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
