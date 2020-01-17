import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

function TaskBrief(props){
    return(
    <Group name={"Task "+props.index} components=
        <div>
        <h4>{props.task.name}</h4>
        {props.task.description}
        <br/><br/>
        <Button variant="primary" type="submit" onClick={props.select}>
        Open</Button>
        </div>
    />
    );
}
class TaskList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show:false,
            newChatId:"",
            searchCriterion:{},
            data:[{id:"12423",name:"Do Your Homework",description:"Stop failing your life and do something"}], 
            taskIndex:0
        };
    }
    
    componentDidMount() {
        const updateData = (responseJson)=>{this.setState({data:responseJson.data});}
        POSTRequest({userID:store.getState().id, query:{}},'/retrieve/tasks',updateData);
    }
    render(){
        const handleClose = ()=>{this.setState({show:false});};
        const handleOpen = (index)=>{this.setState({show:true,taskIndex:index});};
        const takeTask = ()=>{
            const updateData = (responseJson)=>{
                this.setState({show:false,newChatId:responseJson.newChatId});}
            POSTRequest(
                {userID:store.getState().id, 
                    params:{"taskId":this.state.data[this.state.taskIndex]["_id"]}
                },
                '/add/chat',
                updateData);
            //this.setState({show:false}); 
            //this.setState({newChatId:"123"}); 
        } ;
        let datas = this.state.data.map((task,index)=> 
                <TaskBrief task={task} index="" select={()=>handleOpen(index)}/>);
        return (
            <div>
            {this.state.newChatId!=""?<Redirect to={'/task/'+this.state.newChatId}/>:''}
            <Top/>
            
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>Available Tasks</h1>
                {datas}
            </div>
            
            <ShowInfo show={this.state.show} onClose={handleClose}
                title={"Task: "+this.state.data[this.state.taskIndex].name}
                body={this.state.data[this.state.taskIndex].description}
                ok={takeTask} okLabel="Take Up"/>
            </div>
            
        );
    }
}

export {TaskList};
