import React from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import { setPage } from '../redux/slicers/contacts';
import SVG from '../components/svg';
import '../styles/components/pagination.scss';

export default function Pagination() {
    const contacts =  useAppSelector(state => state.contacts.contacts);
    const contactsCount = useAppSelector(state => state.contacts.count);
    const page = useAppSelector(state => state.contacts.page);
    const limit = 10; //do not change this at all.
    const dispatch = useAppDispatch();
  
    const pageValues = () => {
        const totalContacts = contactsCount;
        const totalPages = Math.ceil(contactsCount/limit);
        const startContacts = (page===1)?1:limit * (page - 1) + 1;
        const endContacts = (page===1)?contacts.length:((limit*(page - 1) + contactsCount ));
        const isLastPage = (page=== Math.ceil(contactsCount/limit) );
        const isFirstPage = (page===1);
        const isPrevPage = (page > 1);
        const isNextPage = (totalPages > page);
        return {
            startContacts,
            endContacts, 
            totalContacts,
            isLastPage,
            isPrevPage,
            isNextPage,
            isFirstPage,
            totalPages
        }
    }
return (<div className='paggination-container'> 
            <div className={pageValues().isFirstPage?'disabled':'paggination-btn'} title="First page" onClick={()=> pageValues().isFirstPage?{}:dispatch(setPage(1))}><SVG name='angles-left' color='black' /></div>
            <div className={pageValues().isFirstPage?'disabled':'paggination-btn'} onClick={()=>  pageValues().isPrevPage?dispatch(setPage(page -1)):{}}><SVG name='angle-left' color='black' /></div>
            
            <div className={'paggination-current-page'}>{page} of {Math.ceil(contactsCount/limit)}</div>
            
            <div className={pageValues().isNextPage?'paggination-btn':'disabled'} onClick={()=>  pageValues().isNextPage?dispatch(setPage(page + 1)):{}}><SVG name='angle-right' color='black' /></div>
            
            <div className={pageValues().isLastPage?'disabled':'paggination-btn'} title="Last page" onClick={()=> pageValues().isLastPage?{}: dispatch(setPage(pageValues().totalPages))}><SVG name='angles-right' color='black' /></div>
    </div>)
}