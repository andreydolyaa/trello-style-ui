import React from 'react';
import { Link } from 'react-router-dom';
import './User.scss';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/actions/userActions';

export default function User({ user }) {
    const dispatch = useDispatch();


    const logout = () => {
        sessionStorage.clear();
        dispatch(logoutUser());
    }
    return (
        <div className="user">

            {user &&
                <div className="user-details flex-center">
                    <div style={{position:'relative'}}>
                        <p className="name">{user.fullName}</p>
                        <p className="email">{user.email}</p>
                    </div>
                    <p>|</p>
                    <p onClick={logout} className="logout">Logout</p>
                </div>
            }

            {!user &&
                <div className="log flex-center">
                    <Link to="/login">Login</Link>
                    <p style={{ color: '#fff' }}>|</p>
                    <Link to="/signup">Signup</Link>
                </div>
            }

        </div>
    )
}
