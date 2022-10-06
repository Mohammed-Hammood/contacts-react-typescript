import React, { useState } from "react";
import { SVG } from "../../components";
import { useAppDispatch } from "../../redux/hooks";
import { setPage, setSort } from "../../redux/slicers/contacts";
import { hideModal } from "../../redux/slicers/modal";
import { useNavigate } from "react-router-dom";

export default function SearchContactForm() {
    const q = document.location.pathname.split('/search=')[1];
    const [query, setQuery] = useState<string>(q || "");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim().length > 0) {
            dispatch(hideModal());
            dispatch(setPage(1));
            dispatch(setSort('asc'));
            return navigate(`/search=${query.trim()}`);
        }
    }
    return (<form onSubmit={(e) => handleSubmit(e)}>
        <div className='inputs-container ' id='name-container'>
            <label htmlFor='input-contact-search'> </label>
            <input value={query} onChange={(event) => setQuery(event.target.value)} required className='inputs' maxLength={200} type='text' id='input-contact-search' placeholder='Search...' />
        </div>
        <div className='buttons-container'>
            <button type='submit'><span>
                <SVG name='search' color="white" /></span></button>
            <button type='button' onClick={() => dispatch(hideModal())}>
                <SVG name="xmark" color="black" />
            </button>
        </div>
    </form>)
}