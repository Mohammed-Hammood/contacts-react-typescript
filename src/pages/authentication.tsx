import React, { FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/slicers/authentication";
import { useNavigate } from 'react-router-dom';
import '../styles/pages/authentication.scss';
import { SVG } from "../components";

type InputsData = {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password: string;
}

export default function AuthenticationPage(props: { hostname: string }) {
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [active, setActive] = useState('signin');
    const [message, setMessage] = useState<{ [key: string]: string }>({});
    const [username, setUsername] = useState<string>('')
    const [first_name, setFirst_name] = useState<string>('')
    const [last_name, setLast_name] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    useEffect(() => {
        if (isAuthenticated) { return navigate('/'); }

    }, [isAuthenticated, navigate]);

    const isDataValidated = (data: string[]): boolean => {
        for (let i: number = 0; i < data.length; i++) {
            if (data[i].trim().length === 0) return false;
        }
        return true;
    }
    const sendRequest = ({ data, url }: { data: InputsData, url: string }) => {
        fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    dispatch(login(data));
                    return navigate('/profile');
                }
                else if (data) { setMessage(data); }
            })
            .catch(err => console.log(err));
    }
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (active === 'signup' && isDataValidated([username, first_name, last_name, email, password])) {
            const data = { username: username, first_name: first_name, last_name: last_name, email: email, password: password };
            const url = `${props.hostname}/api/register`;
            sendRequest({ data, url })
        }
        else if (active === 'signin' && isDataValidated([username, password])) {
            const url = `${props.hostname}/api/login`;
            const data = { username: username, password: password };
            sendRequest({ data, url })
        }
    }
    const resetFields = (): void => {
        setUsername("");
        setFirst_name("");
        setLast_name("");
        setEmail("");
        setPassword("");
    }
    return (<div className="authentication-page-container">
        <div className="form-container ">
            <div className="header">
                <div className={(active === 'signin') ? "active" : ""} onClick={() => { setActive('signin'); setMessage({}) }}><span>Sign in</span></div>
                <div className={(active === 'signup') ? "active" : ""} onClick={() => { setActive('signup'); setMessage({}) }}><span>Sign up</span></div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}  >
                <div className={(active === 'signin') ? "inputs-container r-b-r " : "inputs-container l-b-r"} id='inputs-container'>
                    <div className='messages-container'>
                        {(message && message.message) ? message['message'] : ""}
                        {(message && message.email) ? message['email'] : ""}
                        {(message && message.password) ? message['password'] : ""}
                        {(message && message.username) ? message['username'] : ""}
                        {(message && message.lastname) ? message['lastname'] : ""}
                        {(message && message.firstname) ? message['firstname'] : ""}
                    </div>
                    <div>
                        <label htmlFor='username'>Username <span className="red">*</span></label>
                        <input value={username} type='text' maxLength={50} required placeholder='Username' id='username' onInput={(e) => { setUsername((e.target as HTMLInputElement).value) }} />
                    </div>
                    {(active === 'signup') ? <>
                        <div>
                            <label htmlFor='firstname'>First name <span className="red">*</span></label>
                            <input value={first_name} type='text' maxLength={25} required placeholder='First name' id='firstname' onInput={(e) => setFirst_name((e.target as HTMLInputElement).value)} />
                        </div>
                        <div>
                            <label htmlFor='lastname'>Last name <span className="red">*</span></label>
                            <input value={last_name} type='text' maxLength={25} required placeholder='Last name' id='lastname' onInput={(e) => setLast_name((e.target as HTMLInputElement).value)} />
                        </div>
                        <div>
                            <label htmlFor='email'>Email <span className="red">*</span></label>
                            <input value={email} type='email' maxLength={250} required placeholder='Email' id='email' onInput={(e) => setEmail((e.target as HTMLInputElement).value)} />
                        </div>
                    </> : ''}
                    <div>
                        <div className="content-top">
                            <label htmlFor='password'>Password <span className="red">*</span></label>
                            <span className="eye" onClick={()=> setIsPasswordVisible(!isPasswordVisible)}>
                                <SVG name={isPasswordVisible?'eye':'eye-slash'} color='black' />
                            </span>
                        </div>
                        <input value={password} type={isPasswordVisible?'text':'password'} minLength={8} maxLength={30} required placeholder='Password' id='password'
                            onInput={(e) => setPassword((e.target as HTMLInputElement).value)} />
                    </div>
                    {active === 'signin' ?
                        <div>
                            <p className="black">Don't have an account? <span onClick={() => { setActive('signup'); }}>Sign Up</span></p>
                        </div>
                        : <div>
                            <p className="black">Already have an account? <span onClick={() => { setActive('signin'); }}>Sign in</span></p>
                        </div>}
                </div>
                <div className="buttons-container">
                    <button type="submit">{active === 'signin' ? "Sign in" : "Sign up"}</button>
                    <button type="button" onClick={() => { resetFields(); }}>Clear</button>
                </div>
            </form>
        </div>
    </div>)
}