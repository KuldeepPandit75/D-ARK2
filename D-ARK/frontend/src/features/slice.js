import {createSlice} from "@reduxjs/toolkit";

const initialState={
    popupVisible:false,
}

export const slice=createSlice({
    name:'D-ARK',
    initialState,
    reducers:{
        setPopupVisible(state,action){
            state.popupVisible=!state.popupVisible;
        }
    }
})

export const {setPopupVisible}=slice.actions;

export default slice.reducer