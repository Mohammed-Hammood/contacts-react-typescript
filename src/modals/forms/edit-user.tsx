import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/slicers/authentication";
import { hideModal } from "../../redux/slicers/modal";


export default function EditUserForm(props:{hostname:string}) {
    const token = useAppSelector(state => state.authentication.token);
    const user = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();
    const [messages, setMessages] = useState<{ [key: string]: string } | null>(null);
    const [first_name, setFirst_name] = useState<string>(user.first_name || '')
    const [last_name, setLast_name] = useState<string>(user.last_name || '')
    const [email, setEmail] = useState<string>(user.email || '')

    const isDataValidated = (data: string[]): boolean => {
        for (let i: number = 0; i < data.length; i++) {
            if (data[i].trim().length === 0) return false;
        }
        return true;
    }
    const sendRequest = ({ data, url }: { data: {}, url: string }) => {
        fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    setMessages({
                        message: res.statusText
                    })
                }
            }
            )
            .then(data => {
                if (data) {
                    dispatch(setUser(data));
                    dispatch(hideModal());
                }
            })
            .catch(err => console.log(err));
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isDataValidated([first_name, last_name, email])) {
            const data = { first_name: first_name, last_name: last_name, email: email };
            const url = `${props.hostname}/api/user`;
            sendRequest({ data, url })
        }
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}  >
            {messages ?
                <div className='messages-container'>
                    {(messages.message) ? messages['message'] : ""}
                    {(messages.email) ? messages['email'] : ""}
                    {(messages.lastname) ? messages['lastname'] : ""}
                    {(messages.firstname) ? messages['firstname'] : ""}
                </div>
                : null}
            <div className="inputs-container">
                <label htmlFor='firstname'>First name <span className="red">*</span></label>
                <input value={first_name} type='text' maxLength={25} required placeholder='First name' id='firstname' onInput={(e) => setFirst_name((e.target as HTMLInputElement).value)} />
            </div>
            <div className="inputs-container">
                <label htmlFor='lastname'>Last name <span className="red">*</span></label>
                <input value={last_name} type='text' maxLength={25} required placeholder='Last name' id='lastname' onInput={(e) => setLast_name((e.target as HTMLInputElement).value)} />
            </div>
            <div className="inputs-container">
                <label htmlFor='email'>Email <span className="red">*</span></label>
                <input value={email} type='email' maxLength={250} required placeholder='Email' id='email' onInput={(e) => setEmail((e.target as HTMLInputElement).value)} />
            </div>
            <div className="buttons-container">
                <button type="submit">Save</button>
                <button type="button" onClick={() => dispatch(hideModal())}>Close</button>
            </div>
        </form>)
}