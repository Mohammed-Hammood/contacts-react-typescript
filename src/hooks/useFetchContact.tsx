import { contactType, setActiveContact } from '../redux/slicers/contacts';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

type errors = {
    status: number
    message: string
}
const ERRORS = {
    status: 200,
    message: ""
}

export default function useFetchContact(props:{hostname:string}) {
    const { contactId } = useParams();
    const contact_id = parseInt(contactId || "-1");
    const contacts = useAppSelector(state => state.contacts);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<errors>(ERRORS);
    const authentication = useAppSelector(state => state.authentication);
    const dispatch = useAppDispatch();
    useEffect(() => {
        setLoading(true);
        const contactFromContactsArray = contacts.contacts.find((item: contactType) => item.id === contact_id);
        if (contacts.activeContact.id === contact_id) {
            setLoading(false);
        }
        else if (contactFromContactsArray) {
            dispatch(setActiveContact(contactFromContactsArray));
            setLoading(false);
        }
        else {
            const url = `${props.hostname}/api/contact/${contactId}`;
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${authentication.token}`
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    setErrors({
                        status: res.status,
                        message: res.statusText
                    })
                })
                .then(data => {
                    if (data) {
                        dispatch(setActiveContact(data));
                        setLoading(false);
                    }
                })
                .catch(err => console.log(err));
        }

    }, [dispatch, contacts, authentication.token, contactId, contact_id]);
    return {
        loading,
        errors
    }
}