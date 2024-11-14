import { createSlice } from "@reduxjs/toolkit";
const initialState={
    currentUser:null,
    error:null,
    loading:false
};
const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
            state.error=null;
            state.currentUser=null;
        },
        signInSuccess:(state,action)=>{
            state.loading=false;
            state.error=null;
            state.currentUser=action.payload;
        },
        signInFailed:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.currentUser=null;
        },
    }
})
export const {signInStart,signInSuccess,signInFailed}=userSlice.actions;
export default userSlice.reducer;