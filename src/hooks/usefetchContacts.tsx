import { useState, useEffect } from 'react';
import { setContacts } from '../redux/slicers/contacts';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useParams } from 'react-router-dom';

type errorTypes = {
    status: number
    statusText: string
    error: boolean
}
const initialState = {
    status: 200,
    statusText: "",
    error: false,
}
type props = {
    source: string
    hostname:string
}
type urls = {
    [key: string]: string
}
function useFetchContacts(props: props) {
    const authentication = useAppSelector(state => state.authentication);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<errorTypes>(initialState);
    const sort = useAppSelector(state => state.contacts.sort);
    const page = useAppSelector(state => state.contacts.page);
    const contactsCount = useAppSelector(state => state.contacts.count);
    const dispatch = useAppDispatch();
    const { q } = useParams();

    useEffect(() => {
        const urls: urls = {
            'home': `${props.hostname}/api/contacts/?format=json&order=${sort}&page=${page}&limit=10`,
            'search': `${props.hostname}/api/contacts/?format=json&order=${sort}&page=${page}&limit=10&q=${q}`
        };
        if (authentication.isAuthenticated) {
            setLoading(true);
            fetch(urls[props.source], {
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
                        statusText: res.statusText,
                        error: true
                    })
                })
                .then(data => {
                    if (data.results) {
                        dispatch(setContacts(data));
                        setLoading(false)
                    }
                })
                .catch(err => console.log(err));
        }
    }, [sort, page, q, props.source, contactsCount, authentication, dispatch]);

    return {
        loading,
        errors
    }
}

export default useFetchContacts;