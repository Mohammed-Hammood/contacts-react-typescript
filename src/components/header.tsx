import { Link } from 'react-router-dom';
import SVG from './svg';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { showModal } from '../redux/slicers/modal';
import { darkLightModeToggle } from '../redux/slicers/global';
import { useEffect } from 'react';
import '../styles/components/header.scss';

export default function Header() {
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const darkLightMode = useAppSelector(state => state.global.darkLightMode);
    const dispatch = useAppDispatch();
    useEffect(()=> {
        document.getElementsByTagName('body')[0].classList.add(darkLightMode);
    })
    return (
        <header className="header-container">
            <div className='left-group'>
                <Link to='/' className='buttons'>
                    <SVG name='home' color='white' />
                </Link>
            </div>
            <div className='right-group'>
                <div className='buttons' onClick={()=> dispatch(darkLightModeToggle())}>
                    <SVG name='circle-half-stroke' color='white' />
                </div>
                {(!isAuthenticated) ?
                        <Link className='buttons' to='/login' >
                            <SVG name='right-to-bracket' color='white' />
                        </Link>
                    : <>
                        <div className='buttons' onClick={() => dispatch(showModal({ formName: 'search', title: "Search" }))}>
                            <SVG name='search' color='white' />
                        </div>
                        <div className='buttons'>
                            <SVG name='circle-user' color='white' />
                            <div className='dropdown shadow'>
                                <Link to='/profile' >
                                    <SVG name='user' color='black' />
                                    <span>Profile</span>
                                </Link>
                                <button type="button" onClick={() => dispatch(showModal({ formName: 'logout', title: "Logout" }))}>
                                    <SVG name='right-from-bracket' color='black' />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
                    </>
                }
            </div>
        </header>)
}