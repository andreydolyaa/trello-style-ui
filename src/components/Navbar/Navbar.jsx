

import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import User from '../User/User';
import './Navbar.scss';


export default function Navbar({ user }) {
    const history = useHistory();

    const redirect = () => history.push('/');

    return (
        <div className="navbar" >
            <div className="title flex-center">
                <h1 onClick={redirect}>Trevo</h1>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/board">Boards</Link>
                </div>
            </div>
            <User user={user} />
        </div>
    )
}

