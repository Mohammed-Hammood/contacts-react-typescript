import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slicers/authentication";
import { deleteContacts } from "../../redux/slicers/contacts";
import { hideModal } from "../../redux/slicers/modal";

export default function LogoutForm(props: { hostname: string }) {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.authentication.token);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(logout());
        dispatch(deleteContacts());
        dispatch(hideModal());
        const url = `${props.hostname}/api/logout`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
            .then(res => {
                if (res.status === 204) {
                    return navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className='text-container'>
                <p>Do you want to log out?</p>
            </div>
            <div className='buttons-container'>
                <button type='submit' ><span>Logout</span></button>
                <button type='button' onClick={() => { dispatch(hideModal()) }}><span>Close</span></button>
            </div>
        </form>
    )
}