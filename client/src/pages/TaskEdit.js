import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

class EditTask extends React.Component{
    constructor(props) {
        super(props);
        let id= this.props.match.params.id;
        this.state = {
                      taskId:id,
                      task:{name:"",description:""},
                      redirect:false
                     };
    }
    
    componentDidMount() {
        const updateData = (responseJson)=>{
            //alert(JSON.stringify(responseJson));
            this.setState({task:responseJson.data[0]});
        }
        POSTRequest({userID:store.getState().id, query:{_id:this.state.taskId}},'/retrieve/tasks',updateData);
    }
    
    render(){
        const saveName = (e) => {
            let task = this.state.task;
            task.name = e.target.value;
            this.setState({task:task});
        };
        const saveDescription= (e) => {
            let task = this.state.task;
            task.description = e.target.value;
            this.setState({task:task});
        };
        const updateTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, thingId:this.state.taskId,
             update:{name:this.state.task.name, description:this.state.task.description}},
            '/update/task',null);
            alert("Saved the Changes");
            this.setState({redirect:true});
        };
        const deleteTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, thingId:this.state.taskId},
            '/remove/task',null);
            alert("Deleted Task");
            this.setState({redirect:true});
        };
        
        return (
            <div>
            {this.state.redirect ? <Redirect to="/mentoring"/> : ''}
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>
                    Edit the Task</h1>
                
                <Form>
                    <FormControl type="text" placeholder="Enter Name" 
                        className="mr-sm-2" 
                        value={this.state.task.name} onChange={saveName}
                    /><br/>
                    <textarea style={{width:"100%",height:"50vh"}} className="form-control"
                    value={this.state.task.description} onChange={saveDescription}>
                    </textarea>
                    <Button variant="success" onClick={updateTask}>Update</Button>
                    <Button variant="danger" onClick={deleteTask} style={{marginLeft:"1em"}}>Delete</Button>
                </Form>
            </div>
            </div>
        );
    }
}

export {EditTask};
