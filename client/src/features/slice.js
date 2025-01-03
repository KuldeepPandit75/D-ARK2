import {createSlice} from "@reduxjs/toolkit";

const initialState={
    popupVisible:false,
    user:null,
    refetch:false
}

export const slice=createSlice({
    name:'D-ARK',
    initialState,
    reducers:{
        setPopupVisible(state,action){
            state.popupVisible=action.payload;
        },
        reFetchData(state,action){
            state.refetch=!state.refetch;
        },
        setUser(state,action){
            state.user=action.payload;
        }
    }
})

export const {setPopupVisible,setUser,reFetchData}=slice.actions;

export default slice.reducer