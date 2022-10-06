import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSort, setActiveContact, contactType } from '../redux/slicers/contacts';
import { showModal } from '../redux/slicers/modal';
import { Pagination, SVG } from '../components/';
import { useFetchContacts } from '../hooks';
import { Link } from 'react-router-dom';
import '../styles/pages/home.scss';


type Props = {
    source: string
    hostname:string
}

export default function HomePage(props: Props) {
    const { loading, errors } = useFetchContacts(props);
    const contacts = useAppSelector(state => state.contacts.contacts);
    const contactsCount = useAppSelector(state => state.contacts.count);
    const sort = useAppSelector(state => state.contacts.sort);
    const page = useAppSelector(state => state.contacts.page);
    const limit = 10; //do not change this at all because server always returns 10 contacts every request.
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const dispatch = useAppDispatch();

    useEffect(() => {

    }, [dispatch, sort, page, loading, contacts, limit, isAuthenticated, contactsCount, errors]);

    const editContact = (contactId: number): void => {
        const contact = contacts.find((currentValue: contactType) => currentValue.id === contactId);
        if (contact) {
            dispatch(setActiveContact(contact));
            dispatch(showModal({ formName: 'edit-contact', title: "Edit contact" }));
        }
    }
    const deleteContact = (contactId: number): void => {
        const contact = contacts.find((currentValue: contactType) => currentValue.id === contactId);
        if (contact) {
            dispatch(setActiveContact(contact));
            dispatch(showModal({ formName: 'delete-contact', title: "Delete contact" }));
        }
    }
    const pageValues = () => {
        const totalContacts = contactsCount; // the total contacts in db
        const totalPages = Math.ceil(contactsCount / limit); // total pages
        const startContacts = (page === 1) ? 1 : limit * (page - 1) + 1;    // start number of contacts count in the current page
        const endContacts = (page === 1) ? contacts.length : ((limit * (page - 1) + contacts.length)); //end number of contacts count in the current page
        const isLastPage = (page === Math.ceil(contactsCount / limit)); //returns true if the current page is last one
        const isFirstPage = (page === 1); //returns true if the current page is the first one 
        const isPrevPage = (page > 1); // returns true if there is a previous page
        const isNextPage = (totalPages > page); // returns true if there's next page
        return {
            totalContacts,
            startContacts,
            endContacts,
            isLastPage,
            isPrevPage,
            isNextPage,
            isFirstPage,
            totalPages
        }
    }
    if (!isAuthenticated) return (<div className='home-page-container'>
        <div className='warning-container'>
            <div className='required-login'>Login to view contacts list.</div>
            <div><Link to='/login'>Log in</Link></div>
        </div>
    </div>)
    if (loading && !errors.error && contacts.length === 0) return (<div className='loader'></div>);
    return (<div className='home-page-container'>
        <div className='container'>
            <div className='panel-container'>
                <div>{(contactsCount <= limit) ? `Contacts: ${contactsCount}`
                    : <span>{pageValues().startContacts} - {pageValues().endContacts} of {pageValues().totalContacts}</span>}
                </div>{(contactsCount > 1) ?
                    <div>
                        <span>Sort</span>{(sort === 'asc') ?
                            <><span title="Oldest" onClick={() => { dispatch(setSort('des')) }}> <SVG name='angle-up' color='black' /></span></>
                            : <><span title="Newest" onClick={() => { dispatch(setSort('asc')) }}> <SVG name='angle-down' color='black' /></span>
                            </>}
                    </div>
                    : ''}
                <div><button type='button' onClick={() => { dispatch(showModal({ formName: 'add-new-contact', title: 'Add new Contact' })) }}><span>Add contact</span></button></div>
            </div>
            {contactsCount > limit ? <Pagination /> : null}
            <div className='contacts-list-container'>
                {(contactsCount > 0) && contacts.map((item: contactType, index: number) => {
                    return (<div className='contact' id={`${item.id}`} key={index}>
                        <div className='first-group-container'>
                            <div className='name'>
                                <SVG name='user' color='black' />
                                <span>{item.name} </span>
                            </div>
                            <div className='dropdown'>
                                <SVG name='ellipsis' color='black' />
                                <ul className='options-list' id={`options-list-${index}`} >
                                    <li onClick={() => editContact(item.id)}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                                    <li onClick={() => deleteContact(item.id)}><SVG name='trash' color='black' /> <span>Delete</span></li>
                                </ul>
                            </div>
                        </div>{item.email ?
                            <div className='email'>
                                <SVG name='envolope' color='black' />
                                <span>{item.email}</span>
                            </div>
                            : ''}{item.phone_number ?
                                <div className='phone'>
                                    <SVG name='phone' />
                                    <span>{item.phone_number}</span>
                                </div>
                                : ''}
                        <div className='detail'><Link to={`/contact/${item.id}`}>View details</Link> </div>
                    </div>)
                })}
            </div>
            {(contactsCount > limit && contacts.length > 5) ?
                <Pagination /> :
                null}
        </div>
    </div>)
}