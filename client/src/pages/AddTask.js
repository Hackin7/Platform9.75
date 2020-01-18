import * as React from "react";
/*import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

class AddTask extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
                      name:"",
                      description:"",
                      redirect:false
                     };
    }
    
    render(){
        const saveName = (e) => {
            this.setState({name:e.target.value});
        };
        const saveDescription= (e) => {
            this.setState({description:e.target.value});
        };
        const addTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, 
             params:{name:this.state.name, description:this.state.description}},
            '/add/task',null);
            alert("Added");
            this.setState({redirect:true});
        };
        
        return (
            <div>
            {this.state.redirect ? <Redirect to="/mentoring"/> : ''}
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>
                    Add a Task</h1>
                
                <Form>
                    <FormControl type="text" placeholder="Enter Name" 
                        className="mr-sm-2" 
                        value={this.state.name} onChange={saveName}
                    /><br/>
                    <textarea style={{width:"100%",height:"50vh"}} className="form-control"
                    value={this.state.description} onChange={saveDescription}>
                    </textarea>
                    <Button variant="success" onClick={addTask}>Send</Button>
                </Form>
            </div>
            </div>
        );
    }
}

export {AddTask};
*/
import {EditTask} from './TaskEdit.js';
const AddTask = ()=><EditTask isadd={true}/>;
export {AddTask};
