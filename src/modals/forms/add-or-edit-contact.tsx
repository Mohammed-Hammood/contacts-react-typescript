import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hideModal } from "../../redux/slicers/modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { initialContact, setActiveContact } from "../../redux/slicers/contacts";
import { logout } from "../../redux/slicers/authentication";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

type addContactForm = {
    name: string;
    email?: string;
    phone_number?: number | string;
    note?: string;
    address?: string;
}
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required")
        .max(250, "Name must not exceed 250 characters")
        .min(1, "Name must be at least 1 character"),
    email: Yup.string().email('Email is invalid'),
    phone: Yup.number().nullable(),
    address: Yup.string().max(250, "Adress must not exceed 250 characters"),
    note: Yup.string().max(550, "Note must not exceed 550 characters")
});
interface Props { 
    type: string
    hostname:string
 }
export default function AddOrEditContactForm(props: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<addContactForm>({ resolver: yupResolver(validationSchema) })
    const dispatch = useAppDispatch();
    const activeContact = useAppSelector(state => state.contacts.activeContact);
    const contact = props.type === 'edit' ? activeContact : initialContact;
    const navigate = useNavigate();
    const token = useAppSelector(state => state.authentication.token);

    const onSubmit = (data: addContactForm) => {
        const url = props.type === 'edit' && contact ? `${props.hostname}/api/contact/${contact.id}` : `${props.hostname}/api/contact-create`;
        fetch(url, {
            method: props.type === 'edit' ? "PUT" : "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 401) {
                    dispatch(logout());
                } else if (res.status === 200) { return res.json(); }
            })
            .then(data => {
                if (data) {
                    dispatch(setActiveContact(data))
                    dispatch(hideModal());
                    return navigate(`/contact/${data.id}`);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='name'>
                <label htmlFor='input-contact-name'>Contact name: <span className='red'>*</span></label>
                <input type='text' {...register('name', { value: contact.name })} placeholder='Contact name...' />
            </div>
            <div className='email'>
                <label htmlFor='input-contact-email'>Email: </label>
                <input type='text'  {...register('email', { value: contact.email })} placeholder='Email...' />
            </div>
            <div className='phone'>
                <label htmlFor='input-contact-phone'>Phone: </label>
                <input type='number' {...register('phone_number', { value: contact.phone_number })}
                    placeholder='Phone nuber...' />
                <div className="message">
                    {errors ? errors.phone_number?.message : null}
                </div>
            </div>
            <div className='address'>
                <label htmlFor='input-contact-address'>Address: </label>
                <input type='text' {...register('address', { value: contact.address })} placeholder='address...' />
            </div>
            <div className='note'>
                <label htmlFor='input-contact-note'>Note: </label>
                <textarea {...register('note', { value: contact.note })} placeholder='Note...' />
            </div>
            <div className='buttons-container'>
                <button type='submit'><span>Save</span></button>
                <button type='button' onClick={() => { dispatch(hideModal()) }}><span>Close</span></button>
            </div>
        </form>
    )
}