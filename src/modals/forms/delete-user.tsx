import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hideModal } from "../../redux/slicers/modal";
import { logout } from "../../redux/slicers/authentication";
import { deleteContacts } from '../../redux/slicers/contacts';

export default function DeleteUserForm(props:{hostname:string}) {
    const dispatch = useAppDispatch()
    const token = useAppSelector(state => state.authentication.token)
    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url: string = `${props.hostname}/api/user`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
            .then(res => {
                if (res.ok) {
                    dispatch(logout());
                    dispatch(deleteContacts());
                    dispatch(hideModal());
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <form onSubmit={(e) => handleForm(e)}>
            <div className='text-container'>
                <p>Do you want to delete your account?</p>
            </div>
            <div className='buttons-container'>
                <button type='submit' className='delete-btn' ><span>Confirm</span></button>
                <button type='button' onClick={() => { dispatch(hideModal()) }}><span>Close</span></button>
            </div>
        </form>
    )
}