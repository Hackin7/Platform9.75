import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';
import {TaskBrief,TaskEditButton,ChatBrief,stuffMap,searchMatch} from '../TaskChatDisplay.js';

class Mentoring extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            tasks:[],matchTasks:[],
            data:[],matchData:[],
            waitingData:[],matchWaitingData:[],
            donedata:[],  matchDoneData:[],
            searchQuery:"",
            chatid:0
        };
    }
    
    componentDidMount() {
        const updateCData = (responseJson)=>{this.setState({data:responseJson.data,matchData:Object.keys(responseJson.data)});}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:0,mentors:{"$all":[store.getState().name]}}
            },
            '/retrieve/usertasks',updateCData);
        
        const updateInTheWorksData = (responseJson)=>{this.setState({waitingData:responseJson.data,matchWaitingData:Object.keys(responseJson.data)});}
            //alert(JSON.stringify(responseJson));}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:1,mentors:{"$all":[store.getState().name]}}
            },'/retrieve/usertasks',updateInTheWorksData);
        
        const updateDoneData = (responseJson)=>{this.setState({donedata:responseJson.data,matchDoneData:Object.keys(responseJson.data)});}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:2,mentors:{"$all":[store.getState().name]}}
            },'/retrieve/usertasks',updateDoneData);
        
        const updateData = (responseJson)=>{this.setState({tasks:responseJson.data,matchTasks:Object.keys(responseJson.data)});}
        POSTRequest({userID:store.getState().id},'/retrieve/managing/tasks',updateData);
    }
    
    render(){
        const saveQuery = (e)=>{
            this.setState({searchQuery:e.target.value});
        }
        ////Filtering System//////////////////////////////////////////////////////////////
        const filterByTag = (matchKey)=>{
            return (keys)=>{let update={};update[matchKey]=keys;this.setState(update);};
        }
        
        let chatMap = (getTagList,list,key,match) => <div>
                <br/>
                <FormControl type="text" placeholder="Search" className="mr-sm-2"  value={this.state.searchQuery}
                onChange={saveQuery}/>
                {stuffMap(filterByTag,getTagList,list,key, match,
                (task,index)=>
                searchMatch(task,this.state.searchQuery)?<ChatBrief task={task} index={index} select={()=>{}}/>:''
                )}</div>;
        let managingTasks = <div>
                <br/>
                <FormControl type="text" placeholder="Search" className="mr-sm-2"  value={this.state.searchQuery}
                onChange={saveQuery}/>
                {stuffMap(filterByTag,()=>this.state.tasks.map(task=>task.tags),
                            this.state.tasks,"matchTasks", this.state.matchTasks,
                            (task,index)=> searchMatch(task,this.state.searchQuery)?
                            <TaskBrief task={task} button=<TaskEditButton task={task}/>/>:'')}
                </div>
        
        let datas = chatMap(()=>this.state.data.map(chat=>chat.taskInfo.tags),
                            this.state.data,"matchData", this.state.matchData);
                            
        let waitingDatas = chatMap(()=>this.state.waitingData.map(chat=>chat.taskInfo.tags),
                            this.state.waitingData,"matchWaitingData", this.state.matchWaitingData);
        let completedDatas = chatMap(()=>this.state.donedata.map(chat=>chat.taskInfo.tags),
                            this.state.donedata,"matchDoneData", this.state.matchDoneData);
        /////////////////////////////////////////////////////////////////////////////////
        return (
            <div>
            <Top/>
            
            <div style={{marginLeft:"auto",marginRight:"auto",width:"80%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"0.25em"}}>Tasks that you are Mentoring for</h1>
                <Link to="/addtask"><Button variant="secondary">
                    Add Task</Button></Link>
                    <br/><br/>
                
                <TabbedLayout components={
                    [{title:"Tasks Created",component:managingTasks},
                    {title:"Current",component:datas},
                    {title:"In Review",component:waitingDatas},
                    {title:"Completed",component:completedDatas}]
                } />
                
            </div>
            
            </div>
        );
    }
}

export {Mentoring};
