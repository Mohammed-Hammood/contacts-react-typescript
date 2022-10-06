import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setActiveContact } from '../redux/slicers/contacts';
import { logout } from '../redux/slicers/authentication';
import { convertToLocalDate, SVG } from '../components';
import { showModal } from '../redux/slicers/modal';
import { useNavigate } from 'react-router-dom';
import { useFetchContact } from '../hooks';
import { useEffect } from 'react';
import '../styles/pages/contact-detail.scss';

export default function ContactDetailPage(props:{hostname:string}) {
    const { errors, loading } = useFetchContact(props);
    const authentication = useAppSelector(state => state.authentication);
    const contacts = useAppSelector(state => state.contacts);
    const contact = useAppSelector(state => state.contacts.activeContact);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => { 
        if (errors.status === 401) {
            dispatch(logout());
            return navigate('/');
        }
    }, [dispatch, errors.status, navigate, authentication.isAuthenticated, contact, contacts.activeContact]);

    const editContact = () => {
        dispatch(setActiveContact(contact));
        dispatch(showModal({ formName: 'edit-contact', title: "Edit contact" }));
    }
    const deleteContact = () => {
        dispatch(setActiveContact(contact));
        dispatch(showModal({ formName: 'delete-contact', title: "Delete contact" }));
    }
    if (loading) return (<div className='loader'></div>)
    return (<div className='contact-detail-page-container'>
        <div className='container'>
            <div className='contact'  >
                <div className='first-group-container'>
                    <div className='name'>
                        <SVG name='user' color='black' />
                        <span>{contact.name}</span>
                    </div>
                    <div className='dropdown'>
                        <SVG name='ellipsis' color='black' />
                        <ul >
                            <li onClick={() => editContact()}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                            <li onClick={() => deleteContact()}><SVG name='trash' color='black' /> <span>Delete</span></li>
                        </ul>
                    </div>
                </div>{contact.email ?
                    <div className='email'>
                        <SVG name='envolope' color='black' />
                        <span>{contact.email}</span>
                    </div> : null}
                {contact.phone_number ?
                    <div className='phone'>
                        <SVG name='phone' color='black' />
                        <span>{contact.phone_number}</span>
                    </div> : null}
                {contact.address ?
                    <div className='address'><SVG name='location-dot' color='black' /><span>{contact.address}</span> </div>
                    : null}
                {contact.created ?
                    <div className='time' title=''><SVG name='clock' color='black' /><span>Added at {convertToLocalDate(contact.created)}</span> </div>
                    : null}
                {contact.note ?
                    <details>
                        <summary>Note</summary>
                        <div className='note'>{contact.note} </div>
                    </details>
                    : null}
            </div>
        </div>
    </div>)
}