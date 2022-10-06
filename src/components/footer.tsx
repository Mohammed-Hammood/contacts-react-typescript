import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import '../styles/components/footer.scss';

export default function Footer() {
    const is_authenticated = useAppSelector(state => state.authentication.isAuthenticated);

    return (
        <footer>
            {is_authenticated ? <>
                <div className="top-content">
                    <div className="left-content">
                        <Link to='/' >Contacts</Link>
                    </div>
                    <div className="right-content">
                        <Link to='/profile' >Profile</Link>
                    </div>
                </div>
            </> : null}
            <div className="bottom-content">
                <strong>@2022. All rights reserved</strong>
            </div>
        </footer>
    )
}