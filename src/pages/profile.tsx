import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slicers/authentication';
import { showModal } from '../redux/slicers/modal';
import useAuth from '../hooks/useAuth';
import { SVG } from '../components';
import '../styles/pages/profile.scss';


export default function ProfilePage(props: { hostname: string }) {
    const { loading, errors } = useAuth(props);
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const user = useAppSelector(state => state.authentication.user);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (errors.error && errors.status === 401) {
            dispatch(logout());
            return navigate('/profile');
        }
    }, [isAuthenticated, errors, user, dispatch, navigate]);
    if (loading && user.id === 0) return (<div className='loader'></div>);

    return (<div className='profile-page-container'>
        <div className='container'>
            <div className='image-container'>
                <SVG name='user' color='black' />
                {isAuthenticated ?
                    <div className='dropdown-menu-container'>
                        <div className='svg-container' >
                            <SVG name='ellipsis' color='black' />
                        </div>
                        <div className='dropdown-options'>
                            <ul className='options-list' id={`options-list`} >
                                <li onClick={() => { dispatch(showModal({ formName: 'edit-user', title: "Edit" })) }}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                                <li onClick={() => { dispatch(showModal({ formName: 'delete-user', title: "Delete" })) }}><SVG name='trash' color='black' /> <span>Delete</span></li>
                            </ul>
                        </div>
                    </div>
                    : null}
            </div>
            {(user.first_name || user.last_name || user.email || user.username) ?
                <div className='card' >
                    <div className='first-group-container'>
                        <div className='name'>
                            <SVG name='user' color='black' />
                            <span>{user.first_name} {user.last_name}</span>
                            {user.username ?
                                <span className='username'>({user.username})</span>
                                : null}
                        </div>
                    </div>{(user.email) ?
                        <div className='email'>
                            <SVG name='envolope' color='black' />
                            <span>{user.email}</span>
                        </div>
                        : null}
                </div>
                : null}
            {!isAuthenticated ? <div className='card center'>
                <span className='login-required'><Link to='/login' >Log in</Link> to view your profile.</span>
            </div> : null}
        </div>
    </div>)
}