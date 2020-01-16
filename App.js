function Group(props)
function Topic(props){
    return (<div>
    
    </div>);
}
class TopicsList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topics:[], 
        };
    }
    
    componentDidMount() {
        const updateData = (responseJson)=>{this.setState({data:responseJson.notes});}
        POSTRequest({userID:store.getState().id},'/notes',updateData);
    }
    render(){
        const editmode = (index)=>{
            this.setState({mode:true, current:index});
        }
        const addNote = ()=>{
            let newData = this.state.data;
            newData.push(""); //Delete Item
            this.setState({mode:false, data:newData});
            var sendData = {userID:store.getState().id};
            POSTRequest(sendData, '/add', ()=>{});
        }
        const deleteNote = (index)=>{
            let newData = this.state.data;
            newData.splice(index, 1); //Delete Item
            this.setState({mode:false, data:newData, current:index});
            var sendData = {userID:store.getState().id, noteID:index};
            POSTRequest(sendData, '/delete', ()=>{});
        }
        
        const saveNote = (index, value)=>{
            let newData = this.state.data;
            newData[index] = value;
            this.setState({mode:false, data:newData, current:index});
            var sendData = {userID:store.getState().id, noteID:index, value:value};
            POSTRequest(sendData, '/update', ()=>{});
        }
        
        
        
        let datas = this.state.data.map((note,index)=> 
            <Group name={"Note "+index} components=
                <NotesView text={note} select={()=>editmode(index)} 
                delete={()=>deleteNote(index)}/> 
            />);
        return (
            <div>
            <Top/>
            
                <h1 style={{marginTop:"1em",marginBottom:"1em"}}>
                    Tasks</h1>
            
            </div>
        );
    }
}
