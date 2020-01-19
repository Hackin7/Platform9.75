import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo, Tag} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

class UserSettings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name:store.getState().name,
            email:store.getState().email,
            password:store.getState().password
        };
    }
    componentDidMount() {
        this.setState({name:this.props.name, password:this.props.password});
        //alert(JSON.stringify(this.state));
    }
    render(){
        const updateName = (e)=> {
            this.setState({name: e.target.value });
            //this.props.update({name:e.target.value});
        }
        const updateEmail = (e)=> {
            this.setState({email: e.target.value });
        }
        const updatePassword= (e)=> {
            this.setState({password: e.target.value });
        }
        
        const handleSubmit = ()=>{
            //alert("Updated");
            //this.props.update({name:this.state.name,email:this.state.email,password:this.state.password});
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, thingId:store.getState().id,
             update:{//name:this.state.name,
                  email:this.state.email, password:this.state.password}},
            '/update/account',null);
            alert("Updated");
            this.setState({redirect:true});
        };
        const NavBarStuff= <Top/>;
        if (this.state.name==""){
            this.state.name=store.getState().name;
            this.state.email= store.getState().email;
            this.state.password=store.getState().password;
        }
        return(<div>
            {NavBarStuff}
            <div style={{marginLeft:"auto",marginRight:"auto",width:"80%"}}>
                <br/><br/><h1>User Settings</h1>
                <Form>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="name" placeholder="Enter Name" 
                        value={this.state.name} disabled={true}
                        onChange={updateName}/>
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" 
                        value={this.state.email}
                        onChange={updateEmail}/>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                        value={this.state.password}
                        onChange={updatePassword} />
                  </Form.Group>
                 
                 
                 <Button variant="primary" onClick={handleSubmit}>
                    Update
                  </Button>
                </Form>
            </div>
        </div>);
    }
}

UserSettings = linkStore(UserSettings);
export {UserSettings};
