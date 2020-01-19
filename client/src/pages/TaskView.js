import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo, ThingListing} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';
import {ChatInfo} from '../TaskChatDisplay.js';

function Message(props){
    return (<div style={{display:"grid", gridTemplateColumns:"20% auto"}}>
    <b>{props.date} {props.name} : </b>
    <pre>{props.message}</pre><br/>
    </div>);
}
class TaskView extends React.Component{
    constructor(props) {
        super(props);
        let id= this.props.match.params.id;//"0";
        this.state = {data:this.props.data,
                      chatid:id, 
                      message:"",
                      chat:{id:"123", taskid:"123", chats:[],state:0, students:[store.getState().name], mentors:["admin"]},
                      task:{id:"12423",name:"Do Your Homework",description:"Stop failing your life and do something"}
                     };
        
        this.refresh = ()=>{
            //alert();
            const updateTaskData = (responseJson)=>{
                //alert(JSON.stringify(responseJson));
                this.setState({task:responseJson.data[0]});
            }
            const updateData = (responseJson)=>{
                //alert(JSON.stringify(responseJson));
                this.setState({chat:responseJson.data[0]});
                POSTRequest({userID:store.getState().id, query:{_id:this.state.chat.taskid}},'/retrieve/tasks',updateTaskData);
            }
            POSTRequest({userID:store.getState().id, query:{_id:this.state.chatid}},'/retrieve/chats',updateData)
        };
    }
    
    
    componentDidMount() {
        this.refresh();
        this.interval = setInterval(this.refresh, 30000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    render(){
        const saveMessage = (e) => {
            this.setState({message:e.target.value});
        };
        const serverSendMessage = (val)=>{
            let d = new Date();
            let timestamp = "UTC "+d.getUTCDate()+"/"+(d.getUTCMonth()+1)+"/"+d.getUTCFullYear()+" "+d.getUTCHours()+":"+d.getUTCMinutes()+":"+d.getUTCSeconds();
            let newMessage = {text:val, dateTime:timestamp,name:store.getState().name};
            
            let chat = this.state.chat;
            chat.chats.push(newMessage);
            const updateData = (responseJson)=>{
                this.setState({chat:responseJson.data[0]});
            }
            POSTRequest(
                {userID:store.getState().id,thingId:this.state.chatid,
                    update:{chats:newMessage}, method:"$push"},
                '/update/chat',updateData);
        }
        
        const sendMessage = ()=>{
            serverSendMessage(this.state.message);
            this.setState({message:""});
        };
        
        const changeChatState = (val)=>{
            let chat = this.state.chat;
            chat.state=val;
            const updateData = (responseJson)=>{
                this.setState({chat:responseJson.data[0]});
            }
            POSTRequest(
                {userID:store.getState().id,thingId:this.state.chatid,
                    update:{state:chat.state}},
                '/update/chat',updateData);
            this.setState({chat:chat});
        };
        const notify = (subject,content)=>{
            POSTRequest(
                {userID:store.getState().id,
                fromAcc:store.getState().name,
                toAcc:this.state.chat.students.includes(store.getState().name)?
                    this.state.chat.mentors[0]:
                    this.state.chat.students[0],
                 subject:subject,content:content},
                '/notify',null);
        }
        const submitForReview = ()=>{
            changeChatState(1);
             notify("Task: "+this.state.task.name+", Please Review","The student "+this.state.chat.students[0]+" has submited the task for Review. Please review the task on Platform 9.75 within 3 Working days");
            serverSendMessage("Student Action: Submit for Review");
            
        };
        const submitAsApproved = ()=>{
            changeChatState(2);
            notify("Task: "+this.state.task.name+", Completed","Congratulations! Your Mentor "+this.state.chat.mentors[0]+" has marked the task as completed. ");
            serverSendMessage("Mentor Action: Completed");
        };
        const moreWorkNeeded = ()=>{
            changeChatState(0);
            //emailNotify("Mentor Action: More Work Needed","Mentor Action: More Work Needed");
            notify("Task: "+this.state.task.name+", More Work Needed","Your Mentor "+this.state.chat.mentors[0]+" has asked for more work.");
            serverSendMessage("Mentor Action: More Work Needed");
        };
        
        return (
            <div>
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"80%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"0.25em"}}>
                    Task: {this.state.task.name}</h1>
                <ChatInfo chat={this.state.chat} task={this.state.task}/><br/>
                
                {this.state.chat.students.includes(store.getState().name) ?
                    <Button 
                        variant="success" 
                        disabled={!this.state.chat.state==0}
                        onClick={submitForReview}>
                        {this.state.chat.state==0 ? 'Submit for Review': 
                            (this.state.chat.state==1 ? 'Waiting for Review':
                             'Completed')
                         }
                    </Button>
                    :
                    <span>
                        <Button 
                            variant="success" 
                            disabled={!this.state.chat.state==1}
                            onClick={submitAsApproved}>
                            {this.state.chat.state==0 ? 'Work in Progress': 
                                (this.state.chat.state==1 ? 'Mark as Completed':
                                 'Completed')
                             }
                        </Button>
                        {this.state.chat.state>=1 ?
                            <Button variant="danger" onClick={moreWorkNeeded}
                                style={{marginLeft:"1em"}}>
                                Request for More Work
                            </Button>
                            :
                            ''
                        }
                    </span>
                }
                <Button variant="secondary" style={{float:"right"}} onClick={this.refresh}>
                    &#8634;</Button>
                <br/><br/>
                <div style={{height:"50vh", overflowY:"auto"}}>
                    {this.state.chat.chats.map((val,index)=> 
                        <Message date={val.dateTime} name={val.name} message={val.text}/>
                        )
                    }
                </div>
                    {/*<FormControl type="text" placeholder="Enter Message" 
                        className="mr-sm-2" style={{width:"80%"}}
                        value={this.state.message} onChange={saveMessage}
                    />*/}
                <div style={{
                        display:"grid",
                        "grid-template-columns": "90% auto"
                    }}>
                    <textarea style={{width:"100%",height:"2.5em"}}
                        className="form-control"
                        value={this.state.message} onChange={saveMessage}>
                    </textarea>
                    <Button variant="success" onClick={sendMessage}>
                        Send</Button>
                </div>
                <br/>
            </div>
            </div>
        );
    }
}

export {TaskView};
