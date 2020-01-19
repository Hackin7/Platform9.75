import * as React from "react";
import {Button,Card,Form, FormControl, Modal, Table} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo, Tag} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

class EditTask extends React.Component{
    constructor(props) {
        super(props);
        
        let id="-";
        this.isNewTask=(props.isadd!=null && props.isadd);
        if (this.isNewTask){}
        else{id= this.props.match.params.id;}
        this.state = {
                      taskId:id,
                      task:{name:"",description:"", tags:{}},
                      tagCatToAdd:"",
                      tagToAdd:"",
                      redirect:false
                     };
    }
    
    componentDidMount() {
        if (!this.isNewTask){
            const updateData = (responseJson)=>{
                //alert();
                //alert(JSON.stringify(responseJson));
                let task = responseJson.data[0];
                if (Array.isArray(task.tags)){task.tags={};}
                this.setState({task:task});
            }
            POSTRequest({userID:store.getState().id, query:{_id:this.state.taskId}},'/retrieve/tasks',updateData);
        }
    }
    
    render(){
        if (this.state.task.tags==null){
            this.state.task.tags={};
        }
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
        //////////////////////////////////////////////
        const updateTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, thingId:this.state.taskId,
             update:{name:this.state.task.name, description:this.state.task.description, tags:this.state.task.tags}},
            '/update/task',null);
            alert("Saved the Changes");
            this.setState({redirect:true});
        };
        const addTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, 
             params:{name:this.state.task.name, description:this.state.task.description, tags:this.state.task.tags}},
            '/add/task',null);
            alert("Added");
            this.setState({redirect:true});
        };
        const sendTaskIn = ()=>{
            if (this.isNewTask){addTask();}
            else{updateTask();}
        }
        //////////////////////////////////////////////
        const deleteTask = ()=>{
            //const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
            POSTRequest(
            {userID:store.getState().id, thingId:this.state.taskId},
            '/remove/task',null);
            alert("Deleted Task");
            this.setState({redirect:true});
        };
        /////////////////////////////////////////////////////
        const saveTagCat= (e) => {
            this.setState({tagCatToAdd:e.target.value});
        };
        const addTagCat = ()=>{
            let task = this.state.task;
            task.tags[this.state.tagCatToAdd] = [];
            this.setState({task:task});
            this.setState({tagCatToAdd:""});
        };
        const removeTagCat = (cat)=>{
            let task = this.state.task;
            delete task.tags[cat];
            this.setState({task:task});
            this.setState({tagCatToAdd:""});
        };
        const addTag = (cat)=>{
            let tag = prompt("Tag to add to the category: "+cat);
            let task = this.state.task;
            task.tags[cat].push(tag);
            this.setState({task:task});
        };
        const removeTag = (cat,index)=>{
            let task = this.state.task;
            task.tags[cat].splice(index, 1);
            this.setState({task:task});
        };
        return (
            <div>
            {this.state.redirect ? <Redirect to="/mentoring"/> : ''}
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>
                    {this.isNewTask?'Add':'Edit'} Task</h1>
                
                    <b>Name:</b>
                    <FormControl type="text" placeholder="Enter Name" 
                        className="mr-sm-2" 
                        value={this.state.task.name} onChange={saveName}
                    /><br/>
                    
                    <b>Tags:</b>
                    <br/><FormControl type="text" placeholder="Category to Add" 
                        className="mr-sm-2" value={this.state.tagCatToAdd} onChange={saveTagCat}
                        style={{"width":"20%","display":"inline"}}
                    />
                    <Button variant="success" onClick={addTagCat}>Add Category</Button><br/>
                    <br/>
                    <Table striped bordered hover>
                      <thead><tr>
                          <th style={{"width": "16.66%"}}>Categories</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                    {Object.entries(this.state.task.tags).map((val)=>{
                        return (<tr>
                            <th>
                                <Tag name={val[0]} close={()=>removeTagCat(val[0])}/>                          
                            </th><th>
                            {val[1].map((tag,index)=>{
                                return <Tag style={{marginLeft:"0.5em"}} name={tag} close={()=>removeTag(val[0],index)}/>;
                            })}
                            <Button variant="success" onClick={()=>addTag(val[0])} 
                                style={{marginLeft:"1em", padding:"0em", width:"1.5em"}}>+</Button></th>
                            </tr>);})}
                        </tbody></Table>
                    <br/>
                    
                    <b>Description:</b>
                    <textarea style={{width:"100%",height:"50vh"}} className="form-control"
                    value={this.state.task.description} onChange={saveDescription}>
                    </textarea>
                    <br/>
                    <Button variant="success" onClick={sendTaskIn} style={{float:"right"}}>{this.isNewTask?'Add':'Update'}</Button>
                    {this.isNewTask?'':
                    <Button variant="danger" onClick={deleteTask}>Delete</Button>
                    }
                
            </div><br/>
            </div>
        );
    }
}

export {EditTask};
