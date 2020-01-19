import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,Form} from 'react-bootstrap';
import {linkStore, store} from '../globalState.js';
import cookie from "react-cookies";

import * as React from "react";
import {Redirect} from "react-router-dom";
import {POSTRequest} from '../tools/networking.js';

class L extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            creating:false, //
            name:"",//this.data.name,
            email:"",
            password:"",
            id:""
        }//this.data.password};
    }
    render(){
        
        const updateName = (e)=> {
            this.setState({name: e.target.value });
            this.props.update({name:e.target.value});
        }
        const updatePassword= (e)=> {
            this.setState({password: e.target.value });
            this.props.update({password:e.target.value});
        }
        const updateEmail= (e)=> {
            this.setState({email: e.target.value });
            this.props.update({email:e.target.value});
        }
        const updateID = (val)=>{
            if (val != ""){
                let loginAuth = JSON.stringify({id:val, name:this.state.name});
                cookie.save("loginAuth", loginAuth, {path: "/"});
            }
            this.setState({id: val });
            this.props.update({id:val});
        }

        const handleSubmit = ()=>{
            if (this.state.creating){
                POSTRequest({name:this.state.name,email:this.state.email, password:this.state.password},
                '/createaccount', (responseJson)=>{
                    if (responseJson.valid){
                        alert("Account Created");
                        this.setState({creating:false});
                        this.handleSubmit();
                    }else{
                        alert("Account Creation Failed:\nMaybe an account with the same name exists?");
                    }
                });
            }else{
                POSTRequest({name:this.state.name, password:this.state.password},
                '/login', (responseJson) => {
                  updateID(responseJson.id);
                  if (responseJson.id==""){alert("Username and Password not found");}
                  else{}
                });
            }         
        }
        return (
            <header className="App-header">
            {(this.state.id=="" || this.state.id==null) ?  this.state.id==null: <Redirect to="/" />}
            <Form>
             <h2>{this.state.creating ? "Create Account" : "Login"}</h2>
              <Form.Group controlId="formBasicName">
                <Form.Label>Username</Form.Label>
                <Form.Control type="name" placeholder="Enter Name" 
                    value={this.state.name} 
                    onChange={updateName}/>
              </Form.Group>
              
              {this.state.creating ?
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" 
                        value={this.state.email}
                        onChange={updateEmail}/>
                  </Form.Group>
                  :''}
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password"
                    value={this.state.password}
                    onChange={updatePassword} />
              </Form.Group>
             
             
             <Button variant="primary" onClick={handleSubmit}>
                {this.state.creating ? "Create" : "Login"}
              </Button>
              <br/><a onClick={()=>{this.setState({creating:!this.state.creating});}}
                style={{fontSize:"0.7em"}}>
                {!this.state.creating ? "Create an account instead" : "Login instead"}
              </a>
            </Form>
            </header>
        );
    }
}

const Login = linkStore(L);

export default Login;
