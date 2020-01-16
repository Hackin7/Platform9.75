import * as Redux from 'redux';
import { connect } from 'react-redux'

//https://stackoverflow.com/questions/41966762/reactjs-how-to-transfer-data-between-pages
////Global State Code///////////////////////////////////////////////////
const format = {};
const reducer = (state=format, action) => {
    console.log(action);
    return action.value;
};

const store = Redux.createStore(reducer);
const updateStore = function(value){
    return {type:"",value:value};
};
const updatePartStore = function(parts){
    var data = store;
    for(var key in parts){
        data[key] = parts[key];
    }
    return{type:"",value:data};
};

store.dispatch(updateStore({name:"", password:"", id:""}));
////////////////////////////////////////////////////////////////////////
//https://www.tutorialspoint.com/redux/redux_react_example.htm
console.log(store.getState());
const mapStateToProps = (state, ownProps = {}) => {
   return {data:state};
};
const mapDispatchToProps = (dispatch) => {
    return {
        update:(parts)=>dispatch(updatePartStore(parts))
    }
}
const linkStore = connect(mapStateToProps, mapDispatchToProps);////////////////////////////////////////////////////////////////////////
export {linkStore,store};
