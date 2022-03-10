import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface ICrumb{
    address:string,
    nftId:string,
    isFirst:boolean,
    next?:ICrumb,
    // prev?:ICrumb,
    isActive:boolean,
    // makeActive(),
}
export interface CrumSliceState{
    firstCrumb:ICrumb
}
const initialState:CrumSliceState= {
        firstCrumb:{address:'',nftId:'',isActive:true,isFirst:true}
    };
export default createSlice({
    name:'crumbs',
   initialState:initialState,
    reducers:{
        onCrumbClick: (state,action) =>{
            const address = action.payload.address;
            const nftId = action.payload.id;
            let current = state.firstCrumb;
            while(current!==undefined){
                current.isActive = (current.address===address)
                current = current.next;
            }
            state.firstCrumb = state.firstCrumb;
        },
        onNewCrumb: (state,action) =>{
            const newCrumb:ICrumb = {address:action.payload.address,nftId:action.payload.nftId, isActive:true,isFirst:false};
            let current = state.firstCrumb;

            //attach to last crumb
            current = state.firstCrumb;
            while(current.next!==undefined){
                current = current.next;
            }
            current.next = newCrumb;

            //set active state
            current = state.firstCrumb;
            while(current!==undefined){
                current.isActive = (current.address===action.payload.address)
                current = current.next;
            }

            //trigger changes in ui
            state.firstCrumb = state.firstCrumb;
        },
        onClearCrumbs: (state,action) =>{
            state.firstCrumb = initialState.firstCrumb;
        }
    }
});
