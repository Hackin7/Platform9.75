import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout} from '../layout.js';
import {Link, Redirect} from "react-router-dom";
import {linkStore, store} from '../globalState.js';
import {POSTRequest} from '../tools/networking.js';

function ChatBrief(props){
    //alert(JSON.stringify(props.task));
    return(
    <Group name={"Task "+props.index} components=
        <div>
        <h4>{props.task.taskInfo.name}</h4>
        {props.task.taskInfo.description}
        <br/><br/>
        <Link to={'/task/'+props.index}><Button variant="primary" type="submit" onClick={props.select}>
        Open</Button></Link>
        </div>
    />
    );
}


class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:[],
            waitingData:[],
            donedata:[],  
            chatid:0
        };
    }
    
    componentDidMount() {
        const updateData = (responseJson)=>{this.setState({data:responseJson.data});}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:0,students:{"$all":[store.getState().name]}}
            },
            '/retrieve/usertasks',updateData);
        
        const updateInTheWorksData = (responseJson)=>{this.setState({waitingData:responseJson.data});}
            //alert(JSON.stringify(responseJson));}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:1,students:{"$all":[store.getState().name]}}
            },'/retrieve/usertasks',updateInTheWorksData);
        
        const updateDoneData = (responseJson)=>{this.setState({donedata:responseJson.data});}
        POSTRequest(
            {
                userID:store.getState().id,
                query:{state:2,students:{"$all":[store.getState().name]}}
            },'/retrieve/usertasks',updateDoneData);
    }
    render(){
        
        let datas = this.state.data.map((task,index)=> 
                <ChatBrief task={task} index={index} select={()=>{}}/>);
        let waitingDatas = this.state.waitingData.map((task,index)=> 
                <ChatBrief task={task} index={index} select={()=>{}}/>);
        let completedDatas = this.state.donedata.map((task,index)=> 
                <ChatBrief task={task} index={index} select={()=>{}}/>);
        return (
            <div>
            <Top/>
            
            <div style={{marginLeft:"auto",marginRight:"auto",width:"60%"}}>
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>Dashboard</h1>
                <Link to="/tasklist"><Button variant="secondary">
                    Find More Tasks</Button></Link>
                    <br/><br/>
                <TabbedLayout components={
                    [{title:"Current",component:datas},
                    {title:"In Review",component:waitingDatas},
                    {title:"Completed",component:completedDatas}]
                }/>
                
            </div>
            
            </div>
        );
    }
}

export {Home};
