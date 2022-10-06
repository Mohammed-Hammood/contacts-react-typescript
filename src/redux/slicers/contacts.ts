import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type contactType = {
    id: number
    name: string
    email: string
    address: string
    note: string 
    created: string
    phone_number: number | undefined
}

type types = {
    contacts: []
    activeContact: contactType
    sort?:string
    page:number
    count:number
}
export const initialContact = {
    id:0,
    name:"",
    email:"",
    note:"",
    phone_number:undefined,
    created:"",
    address:"",
    updated:""
}
const initialState:types = {
    contacts: [],
    activeContact: initialContact,
    sort:'asc',
    page:1,
    count:0
}
const contactsSlicer = createSlice({
    name:"contacts",
    initialState: initialState,
    reducers: {
        setContacts(state, action:PayloadAction<{results:[], count:number}>){
            state.contacts = action.payload.results;
            state.count = action.payload.count;
        },
        setPage(state, action:PayloadAction<number>){
            state.page = action.payload;
        },
        setCount(state, action:PayloadAction<number>){
            state.count = state.count + action.payload;
        },
        setActiveContact(state, action:PayloadAction<contactType>){
            state.activeContact = action.payload
        },
        setSort(state, action:PayloadAction<string>){
            state.sort = action.payload
        },
        deleteContacts(state){
            state.contacts = [];
            state.activeContact = initialContact;
        }
    }
});

export const { setContacts, setActiveContact, setSort, setPage, setCount, deleteContacts } = contactsSlicer.actions

export const selectContacts = (state:RootState) => state.contacts

export default contactsSlicer.reducer