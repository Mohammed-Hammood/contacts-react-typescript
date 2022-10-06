import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { hideModal } from '../redux/slicers/modal';
import '../styles/components/modals.scss';
import * as Forms from './forms';

export default function Modal(props: { hostname: string }) {
    const modal = useAppSelector(state => state.modal);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.onkeydown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && modal.isVisible) {
                dispatch(hideModal());
            }
        }
    }, [modal, dispatch])
    if (!modal.isVisible) return null;
    const renderForm = () => {
        interface Forms {
            [key: string]: JSX.Element
        }
        const forms: Forms = {
            "edit-contact": <Forms.AddOrEditContactForm type='edit' {...props} />,
            "delete-contact": <Forms.DeleteContactForm {...props} />,
            "search": <Forms.SearchContactForm />,
            "logout": <Forms.LogoutForm {...props} />,
            "add-new-contact": <Forms.AddOrEditContactForm type='add' {...props} />,
            "delete-user": <Forms.DeleteUserForm {...props} />,
            "edit-user": <Forms.EditUserForm {...props} />
        }
        if (modal.formName) return forms[modal.formName];
        return null;
    }
    return (<div className='modal-page-container'>
        <div className="modal-container">
            <div className='content-container'>
                <div className='modal-header-container'>
                    <div className='title'><span>{modal.title}</span></div>
                    <div onClick={() => dispatch(hideModal())}>
                        <span className='close' title='Close'>&times;</span>
                    </div>
                </div>
                <div className='body-container'>
                    {renderForm()}
                </div>
            </div>
        </div>
    </div>)
}