import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

function Message(props){
    return (<div>
    <b>{props.date} {props.name} : </b>{props.message}
    </div>);
}
class TaskView extends React.Component{
    constructor(props) {
        super(props);
        let id= this.props.match.params.id;//"0";
        this.state = {data:this.props.data,
                      chatid:id, 
                      message:"",
                      chat:{id:"123", taskid:"123", chats:[],state:0, students:[store.getState().name]},
                      task:{id:"12423",name:"Do Your Homework",description:"Stop failing your life and do something"}
                     };
    }
    
    componentDidMount() {
        const updateTaskData = (responseJson)=>{
            //alert(JSON.stringify(responseJson));
            this.setState({task:responseJson.data[0]});
        }
        const updateData = (responseJson)=>{
            //alert(JSON.stringify(responseJson));
            this.setState({chat:responseJson.data[0]});
            POSTRequest({userID:store.getState().id, query:{_id:this.state.chat.taskid}},'/retrieve/tasks',updateTaskData);
        }
        const refresh = ()=> {POSTRequest({userID:store.getState().id, query:{_id:this.state.chatid}},'/retrieve/chats',updateData)};
        refresh();
        this.interval = setInterval(refresh, 30000);
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
        const submitForReview = ()=>{
            changeChatState(1);
            serverSendMessage("Student Action: Submit for Review");
        };
        const submitAsApproved = ()=>{
            changeChatState(2);
            serverSendMessage("Mentor Action: Completed");
        };
        const moreWorkNeeded = ()=>{
            changeChatState(0);
            serverSendMessage("Mentor Action: More Work Needed");
        };
        return (
            <div>
            <Top/>
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>
                    Task: {this.state.task.name}</h1>
                {this.state.task.description}
                <br/><br/>
                
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
                        {this.state.chat.state==1 ?
                            <Button variant="danger" onClick={moreWorkNeeded}
                                style={{marginLeft:"1em"}}>
                                Request for More Work
                            </Button>
                            :
                            ''
                        }
                    </span>
                }
                <br/><br/>
                <div style={{height:"45vh", overflowY:"auto"}}>
                    {this.state.chat.chats.map((val,index)=> 
                        <Message date={val.dateTime} name={val.name} message={val.text}/>
                        )
                    }
                </div>
                <Form inline>
                    <FormControl type="text" placeholder="Enter Message" 
                        className="mr-sm-2" style={{width:"80%"}}
                        value={this.state.message} onChange={saveMessage}
                    />
                    <Button variant="success" onClick={sendMessage}>Send</Button>
                </Form>
            </div>
            </div>
        );
    }
}

export {TaskView};
