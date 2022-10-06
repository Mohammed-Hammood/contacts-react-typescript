import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const tokenInLocalStorage = '___token____#$%^^'

type User = {
    id:number
    username?:string
    first_name?:string
    last_name?:string
    email?:string    
}

type InitialState = {
    isAuthenticated:boolean
    user:User
    token:string   
}
const initialUser = {
    id:0,
    username:'',
    first_name:'',
    last_name:'',
    email:'',
}
const initialState:InitialState = {
    isAuthenticated: false,
    user: initialUser,
    token: localStorage.getItem(tokenInLocalStorage) || ""
}

const authentication = createSlice({
    name:'authentication',
    initialState: initialState,
    reducers: {
        login(state, action:PayloadAction<InitialState>){
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem(tokenInLocalStorage, action.payload.token)
        },
        setUser(state, action:PayloadAction<User>){
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state){
            state.isAuthenticated = false;
            state.token = "";
            state.user = initialUser;
            localStorage.removeItem(tokenInLocalStorage);
        }
    }

});

export const { login, logout, setUser} = authentication.actions

export default authentication.reducer