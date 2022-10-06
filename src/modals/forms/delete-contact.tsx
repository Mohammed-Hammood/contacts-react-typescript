import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCount, setPage } from '../../redux/slicers/contacts';
import { logout } from "../../redux/slicers/authentication";
import { hideModal } from "../../redux/slicers/modal";

export default function DeleteContactForm(props:{hostname:string}){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const contact = useAppSelector(state => state.contacts.activeContact);
    const token = useAppSelector(state => state.authentication.token);

    const submitEvent = (e:React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();
        const url = `${props.hostname}/api/contact/${contact.id}`;
        fetch(url, {
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Token ${token}`
            }
        })
        .then((res) => {
                if(res.status===204){
                    dispatch(hideModal());
                    dispatch(setPage(1));
                    dispatch(setCount(-1));
                    return navigate('/');
                }
                else if(res.status===401){
                    dispatch(logout());
                }
        })
        .catch(err => console.log(err));
    }

    return (<form onSubmit={(e)=>submitEvent(e)}>    
                <div className='text-container'>
                    <p>Do you want to delete <Link to={`/contact/${contact.id}`}>{contact.name}</Link>?</p>
                </div>
                <div className='buttons-container'>
                    <button type='submit' className='delete-btn' ><span>Confirm</span></button>
                    <button type='button' onClick={()=> {dispatch(hideModal()) }}><span>Close</span></button>
                </div>
            </form>)
    }