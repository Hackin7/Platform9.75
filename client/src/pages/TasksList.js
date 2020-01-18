import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';
import {getAvailableTags, TaskInfo, TaskBrief, ChatBrief,stuffMap,searchMatch} from '../TaskChatDisplay.js';

function TaskItemShow(props){
    return (<TaskBrief task={props.task} 
                    button=<Button variant="primary" type="submit" onClick={props.select}>Open</Button>
            />);
}
class TaskList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show:false,
            newChatId:"",
            searchCriterion:{},
            data:[{id:"12423",name:"Loading",description:"Please be patient with us", mentors:["admin"], tags:{}}], 
            match:[],
            searchQuery:"",
            taskIndex:0
        };
    }
    
    componentDidMount() {
        const updateData = (responseJson)=>{
            let match = Object.keys(responseJson.data);
            //alert(JSON.stringify(match));
            this.setState({data:responseJson.data, match:match});}
        POSTRequest({userID:store.getState().id, query:{}},'/retrieve/tasks',updateData);
    }
    
    render(){
        let tagIndex = Object.keys(this.state.data);
        let tagList = this.state.data.map(task=>task.tags);
        //alert("Tags: "+JSON.stringify(this.state.data.map(task=>task.tags))+" "+JSON.stringify(getAvailableTags(tagIndex, tagList) ) );
        
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
        const saveQuery = (e)=>{
            this.setState({searchQuery:e.target.value});
        }
        ////Filtering System//////////////////////////////////////////////////////////////
        const filterByTag = (matchKey)=>{
            return (keys)=>{let update={};update[matchKey]=keys;this.setState(update);};
        }
        
        let managingTasks = stuffMap(filterByTag,()=>this.state.data.map(task=>task.tags),
                            this.state.data,"match", this.state.match,
                            (task,index)=> searchMatch(task,this.state.searchQuery)?<TaskItemShow task={task} select={()=>handleOpen(index)}/>:'');
        /////////////////////////////////////////////////////////////////////////////////////////////
        return (
            <div>
            {this.state.newChatId!=""?<Redirect to={'/task/'+this.state.newChatId}/>:''}
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"80%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>Available Tasks</h1>
                <FormControl type="text" placeholder="Search" className="mr-sm-2"  value={this.state.searchQuery}
                onChange={saveQuery}/>
                {/*<TagSelection getTagList={()=> this.state.data.map(task=>task.tags)} onChange={filterByTag}/>*/}
                {managingTasks/*datas*/}
            </div>

            
            <ShowInfo show={this.state.show} onClose={handleClose}
                title={"Task: "+this.state.data[this.state.taskIndex].name}
                body=<TaskInfo task={this.state.data[this.state.taskIndex]}/>
                ok={takeTask} okLabel="Take Up"/>
            </div>
            
        );
    }
}

export {TaskList};
