import * as React from "react";
import {Button,Card,Form, FormControl, Modal} from 'react-bootstrap';
import {Top, Group, TabbedLayout, ShowInfo, ThingListing} from './layout.js';
import {Link, Redirect} from "react-router-dom";
///Tag Filtering/////////////////////////////////////////////////
const inArray = function(item,array){
    for (let i in array){
        if (array[i] == item){return true;}
    }
    return false;
};
const getAvailableTags = function(tagIndex, tagList){
    let allTags = {};
    //tagIndex = $scope.search.found;
    //alert($scope.search.found);
    //tagList = $scope.allQuestions;
    
    //alert("Tag List"+JSON.stringify(tagList)+":"+JSON.stringify(tagIndex));
    for (let q in tagList){
    //for (let i in tagIndex){
    //    let q = tagIndex[i];
        let catTags = tagList[q];
        //alert(q+" "+JSON.stringify(catTags));
        if (catTags==null){continue;}
        for (let cat in catTags){
            //alert(cat);
            if (allTags[cat] == undefined){
                allTags[cat] = [];
            }
            for (let tag in catTags[cat]){
                if (!inArray(catTags[cat][tag],allTags[cat]) ){
                    allTags[cat].push(catTags[cat][tag])
                } 
            }
        }
    }
    return allTags;
}

const searchitems = function(tagsList,givenTags){
    //givenTags = $scope.search.tagSelect;
    let meetCondition = [];
    for (let q in tagsList){
        let SkipTag = false;
        let tagTags = tagsList[q];
        //Categories
        for (let cat in givenTags){
            //All tags
            for (let tag in givenTags[cat]){
                if (givenTags[cat][tag] && !inArray(tag,tagTags[cat]) ){
                    //Skip This Tag
                    SkipTag = true;
                    break;
                }
            }
            if (SkipTag){break;}
        }
        if (!SkipTag){
            meetCondition.push(q);//AllTags[q]);
        }
    }
    return meetCondition;
}
class TagSelection extends React.Component{
    constructor(props) {
        super(props);
        this.getTagList = ()=> props.getTagList();        
        this.state = {
            keys:Object.keys(this.getTagList()),
            query:{}
        };
        this.getTags = ()=>{
            this.setState({tags:getAvailableTags(this.state.keys,this.getTagList())});
        };
        this.change = props.onChange;
    }
    
    componentDidMount() {
        //this.getTags();
        //alert(JSON.stringify(this.state) +" "+JSON.stringify(this.tagList));
    }
    
    render(){
        let availableTags=getAvailableTags(this.state.keys,this.getTagList());
        const setQuery = (cat,tag,val)=>{
            let q = this.state.query;
            if (q[cat]==null){q[cat] = {};}
            
            q[cat][tag]= val;//(val=="");
            //alert(JSON.stringify(q)+"\n"+JSON.stringify(searchitems(this.getTagList(),q)));
            let newKeys = searchitems(this.getTagList(),q);
            this.change(newKeys);
            this.setState({query:q, keys:newKeys});
        }
        let q = this.state.query;
        //alert("HH"+JSON.stringify(this.getTagList()));
        //alert(JSON.stringify(this.state) +" "+JSON.stringify(this.tagList));
        return (<div><h4>Tags</h4>
        {Object.keys(availableTags).map((cat,index)=>{
            return (<div><b>{cat}</b><br/>
                {availableTags[cat].map((tag,index)=>{
                    if (q[cat] == null){q[cat] = {};}
                    return (<span>
                                <input type="checkbox"
                                 value={q[cat][tag]} onChange={(e)=>setQuery(cat,tag,e.target.checked)}/>
                                <span style={{marginLeft:"1em"}}>{tag}</span>
                            <br/></span>);
                })}
            </div>);
        })}
        </div>);
    }
}

let stuffMap =  (filterByTag,getTagList,list,key,match,method) => 
                <span style={{display:"grid",gridTemplateColumns:"20% auto"}}>
                <div><br/>
                    {list.length>0 ? 
                        <TagSelection getTagList={getTagList} onChange={filterByTag(key)}/>
                        : <h5>No Items Here</h5>
                        }
                </div>
                <div>
                    {list.map((task,index)=> 
                    {return match.includes(index.toString())?
                            method(task,index):'';
                    })}
                    
                </div>
                </span>;

///Search Functionality//////////////////////////////////////////
function match(arr, skip_keys, search) {
    var stack = []
    var keys = Object.keys(arr)

    for (var i = 0; i < keys.length; i++) {
        if (!skip_keys.includes(keys[i])) {
            if (typeof arr[keys[i]] == 'string') {
                if (arr[keys[i]].includes(search)) {
                    return true
                }
            }
            else {
                stack.push(arr[keys[i]])
            }
        }
    }

    while (stack.length != 0) {
        var temp = stack.shift()
        var keys = Object.keys(temp)

        for (var j = 0; j < keys.length; j++) {
            if (!skip_keys.includes(keys[j])) {
                if (typeof temp[keys[j]] == 'string') {
                    if (temp[keys[j]].includes(search)) {
                        return true
                    }
                }
                else {
                    stack.unshift(temp[keys[j]])
                }
            }
        }
    }
    return false
}
const searchMatch = (arr,search)=>match(arr,["_id","taskid","state"],search);
/*

    var data = [{
        "_id":"1",
        "taskid":"0",
        "students":["lolcatz"],
        "mentors":["admin"],
        "chats":[{
            "text":"Yes another Hello World Task",
            "dateTime":"UTC 16/1/2020 23:16:39",
            "name":"lolcatz"
        },{
            "text":"\nThis is a message",
            "dateTime":"UTC 18/1/2020 2:57:20",
            "name":"admin"
        },{
            "text":"asdfgh",
            "dateTime":"UTC 18/1/2020 4:22:31",
            "name":"admin"
        }],
        "state":0,
        "taskInfo":{
            "_id":"0",
            "name":"Hello",
            "description":"World",
            "mentors":["admin"],
            "tags":{"Difficulty":["Lol"]}
        }
    },{
        "_id":"2",
        "taskid":"0",
        "students":["lolcatz"],
        "mentors":["admin"],
        "chats":[{
            "text":"Yes another Hello World Task",
            "dateTime":"UTC 16/1/2020 23:16:39",
            "name":"lolcatz"
        },{
            "text":"\nThis is a test message",
            "dateTime":"UTC 18/1/2020 2:57:20",
            "name":"admin"
        },{
            "text":"asdfgh",
            "dateTime":"UTC 18/1/2020 4:22:31",
            "name":"admin"
        }],
        "state":0,
        "taskInfo":{
            "_id":"0",
            "name":"Hello",
            "description":"World",
            "mentors":["admin"],
            "tags":{"Difficulty":["L"]}
        }
    }]
var search = window.prompt('search: ')
var found_data = []
var skip_keys = []

for (var i = 0; i < data.length; i++) {
    if (match(data[i], skip_keys, search)) {
        found_data.push(data[i])
    }
}

console.log(found_data)

*/
///React Components//////////////////////////////////////////////
function TaskInfo(props){
    if (props.task.tags==null){props.task.tags={};}
    let tagShow = <span><b>Tags: </b>{JSON.stringify(props.task.tags)}</span>;
    return (<div style={{maxHeight:"50vh", overflowY:"auto"}}>
        <ThingListing list={props.task.mentors} label="Mentors: "/><br/>
        {tagShow}<br/>
        <b>Description: </b>{props.task.description}
        </div>);
}
function ChatInfo(props){
    let peopleShow = <span><ThingListing list={props.chat.students} label="Students: "/> 
                     <ThingListing sidespace="1em" list={props.chat.mentors} label="Mentors: "/>
                    </span>;
    if (props.task.tags==null){props.task.tags={};}
    let tagShow = <span><b>Tags: </b>{JSON.stringify(props.task.tags)}</span>;
    return (<div style={{maxHeight:"50vh", overflowY:"auto"}}>
        {peopleShow}<br/>
        {tagShow}<br/>
        <b>Description: </b>{props.task.description}
        </div>);
}
function TaskBrief(props){
    //alert(JSON.stringify(props.task));
    return(
    <Group name={"Task "} components=
        <div>
            <h4>{props.task.name}</h4>
            <TaskInfo task={props.task}/>
            <br/>
            {props.button}
        </div>
    />
    );
}
function TaskEditButton(props){
    return (<Link to={'/edit/'+props.task._id}><Button variant="primary" type="submit" onClick={props.select}>
        Edit</Button></Link>);
}
function ChatBrief(props){
    let peopleShow = <span><ThingListing list={props.task.students} label="Students: "/> 
                     <ThingListing sidespace="1em" list={props.task.mentors} label="Mentors: "/>
                    </span>;
    if (props.task.tags==null){props.task.tags={};}
    let tagShow = <span><b>Tags: </b>{JSON.stringify(props.task.tags)}</span>;
    return(
    <Group name={"Task"} components=
        <div>
        <h4>{props.task.taskInfo.name}</h4>
        <ChatInfo chat={props.task} task={props.task.taskInfo}/>
        <br/>
        
        <Link to={'/task/'+props.task._id}><Button variant="primary" type="submit" onClick={props.select}>
        Open</Button></Link>
        </div>
    />
    );
}

export {stuffMap,searchMatch, TaskInfo, ChatInfo, TaskBrief,TaskEditButton,ChatBrief };
