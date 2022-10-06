import { useState, useEffect } from 'react';
import { logout, setUser } from '../redux/slicers/authentication';
import { useAppDispatch, useAppSelector } from '../redux/hooks'

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

function useAuthentication(props:{hostname:string}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<errorTypes>(initialState);
    const token = useAppSelector(state => state.authentication.token);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (token.trim().length > 0) {
            setLoading(true);
            const url = `${props.hostname}/api/user`;

            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
                .then(res => {
                    if (res.status === 200) { return res.json(); }
                    else if (res.status === 403) {
                        dispatch(logout());
                    }
                    setErrors({
                        status: res.status,
                        statusText: res.statusText,
                        error: true
                    })
                })
                .then(data => {
                    if (data) {
                        dispatch(setUser(data));
                    }
                    setLoading(false)
                })
                .catch(err => console.log(err));
        }

    }, [dispatch, token])
    return {
        loading,
        errors
    }
}
export default useAuthentication;