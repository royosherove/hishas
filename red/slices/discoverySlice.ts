import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IInvestigator } from "../../investigators/base/IInvestigator";
import { JsonInfo } from "../../investigators/base/IInvestiationLogger";

export interface ICodeData{
    code:string,
    name:string,
    address?:string
}
export interface IImageData{
    uri:string
    usableUri:string
    desc:string
}
export interface IProp {
    name:string
    value:string
    severity:number
    notes:string
    category:string
}
export interface IDiscoveryState{
        status:string
        logs:string
        targetAddress:string
        nftId:string
        JSONMetadata:string
        metadataPath:string
        metadataUsablePath:string
        propsToShow:IProp[],
        codes:ICodeData[],
        ownerCodes:ICodeData[],
        agents: IInvestigator[]
        images: IImageData[],
        jsonFiles: JsonInfo[]
}
const initialState:IDiscoveryState = {
        metadataPath:'',
        metadataUsablePath:'',
        status:'ready',
        logs:'',
        targetAddress:'0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        nftId:'100',
        images:[],
        JSONMetadata:'',
        propsToShow:[],
        ownerCodes:[],
        codes:[],
        agents: [],
        jsonFiles:[]
    };
export default createSlice({
    name:'discovery',
   initialState:initialState,
    reducers:{
        onTargetAddress: (state,action)=>{
            state.targetAddress = action.payload;
        },
        onNftId: (state,action)=>{
            state.nftId = action.payload;
        },
        onAgentRegister: (state,action)=>{
            if(state.agents.find(a=>a.name === action.payload.name)){
                return;
            }
            state.agents.push(action.payload)
        },
        onAgentStop: (state,action)=>{
            state.agents = [...state.agents];
        },
        onAgentStart: (state,action)=>{
            state.agents = [...state.agents];
        },
        clearLogs: (state,action) =>{
            state.targetAddress = state.targetAddress.trim();
            state.status = initialState.status;
            state.logs = initialState.logs;
            state.images = initialState.images;
            state.JSONMetadata = initialState.JSONMetadata;
            state.propsToShow = initialState.propsToShow;
            state.codes = initialState.codes;
            state.ownerCodes = initialState.ownerCodes;
            state.agents = initialState.agents;
            state.jsonFiles = initialState.jsonFiles;
            // state.nftId = initialState.nftId
            // state.targetAddress = initialState.targetAddress
        },
        onOwnerCode: (state,action) =>{
            state.ownerCodes.push(action.payload);
        },
        onCode: (state,action) =>{
            state.codes.push(action.payload);
        },
        onProp: (state,action) =>{
            state.propsToShow.push( {category:action.payload.category || '',notes:action.payload.notes,severity:action.payload.severity, name:action.payload.name, value:action.payload.value});
        },
        onJson: (state,action) =>{
            state.jsonFiles.push(action.payload)
            // state.metadataUsablePath= action.payload.jsonUsablePath;
            // state.metadataPath= action.payload.jsonPath;
            // state.JSONMetadata= action.payload.jsonRaw;
        },
        onImage: (state,action) =>{
            state.images.push(action.payload);
        },
        onLog: (state,action) =>{
            state.logs+= '\n';
            state.logs+= action.payload.log;
        },
        onStatus: (state,action) =>{
            state.status = action.payload.status;
        }
    }
});
