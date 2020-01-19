import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,NavItem,Card,Navbar,Nav,Dropdown,DropdownButton, Modal,Tabs,Tab,Badge} from 'react-bootstrap';
import * as React from 'react';
import cookie from "react-cookies";
import {linkStore, store} from './globalState.js';
import {Redirect,Link} from "react-router-dom";
import {POSTRequest} from './tools/networking.js';

function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => ++value); // update the state to force render
}

function Top(props){
    const forceUpdate = useForceUpdate();
    var loginAuth = cookie.load('loginAuth');
    //alert(loginAuth);
    //alert(window.loggedin);
    if (loginAuth != null && store.getState().id == ""){
        //let loginAuthData = JSON.parse(loginAuth);
        //alert(loginAuth.name);
        POSTRequest({id:loginAuth.id, name:loginAuth.name},
        '/authid',
        (responseJson) => {
          if (responseJson.valid){
              //alert(JSON.stringify(responseJson));
              props.update({id:loginAuth.id,
                name:loginAuth.name,
                password:responseJson.password});
              //alert();
            }
            else{
                cookie.remove("loginAuth", {path: "/"});
                alert("Session Expired");
            }
            //forceUpdate();
        });
        props.update({id:loginAuth.id, name:loginAuth.name});
    }
    const logout = ()=>{
        //alert("Logging Out");
        cookie.remove("loginAuth", {path: "/"});
        props.update({id:""});
        forceUpdate();
    }
    
    const UserMenu = 
        <DropdownButton title={store.getState().name} variant="secondary"
                        style={{paddingLeft:"5em"}}>
                <Dropdown.Item><Link to="/usersettings" style={{color:"black"}}>User Settings</Link></Dropdown.Item>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </DropdownButton>;
        
    return(
      <Navbar bg="dark" variant="dark">
      {store.getState().id=="" || store.getState().id==null ? <Redirect to="/login"/> : ''}
    <Link to="/"><Navbar.Brand>Platform 9.75</Navbar.Brand></Link>
    <Nav className="mr-auto">
      <Link to="/" style={{color:"gray"}}><NavItem>Dashboard</NavItem></Link>
      <Link to="/tasklist" style={{paddingLeft:"1em",color:"gray"}}><NavItem>Task List</NavItem></Link>
      <Link to="/mentoring" style={{paddingLeft:"1em",color:"gray"}}><NavItem>Mentoring</NavItem></Link>
      {/*<Link to="/suggest" style={{ paddingLeft:"1em",color:"gray"}}><NavItem>Suggest Task</NavItem></Link>*/}
      {/*<Link to="/addtask" style={{ paddingLeft:"1em",color:"gray"}}><NavItem>Add Task</NavItem></Link>*/}
    </Nav>
    {UserMenu}
  </Navbar>);
}

Top = linkStore(Top);
function Group(props){
    return (
    <Card style={{margin:"1em"}}>
        {props.name!=null ? <Card.Header>{props.name}</Card.Header> : ''}
        <Card.Body>
        {props.components}
        </Card.Body>
    </Card>
    );
}


function ShowInfo(props){
    return(
    <Modal show={props.show} onHide={props.onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.body}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.onClose}>
        Close
      </Button>
      {props.okLabel != null ? <Button variant="primary" onClick={props.ok}>
        {props.okLabel}
      </Button>: ''}
    </Modal.Footer>
  </Modal>);
    
}
//https://react-bootstrap.github.io/components/tabs/
function TabbedLayout(props){
    const [key, setKey] = React.useState(0);
    
    return (<Tabs activeKey={key} onSelect={k => setKey(k)} transition={false}>
      {props.components.map((component,index)=> 
        <Tab eventKey={index} title={component.title}>{component.component}
      </Tab>)}
    </Tabs>);
}
function ThingListing(props){
    let sidespace = "0em";
    if (props.sidespace!=null){sidespace = props.sidespace;}
    return <span style={{marginLeft:sidespace}}>
                <b>{props.label}</b> 
                {props.list.map((item,index)=>{
                    if (index!=0){return ', ' +item;}
                    else{return item;}
                })}
            </span>;
}
function Tag(props){
    return (<Badge variant="primary" disabled={true}>
              <span>{props.name}</span>
              {props.close==null?'':
              <button onClick={props.close} 
                    style={{padding:0,border:"none",background:"none", paddingLeft:"0.5em", color:"white"}}>
                    ×</button> }
            </Badge>);
}
export {Top,Group,ShowInfo,TabbedLayout,ThingListing,Tag};
