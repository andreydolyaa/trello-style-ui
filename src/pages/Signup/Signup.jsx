

import React, { useRef, useState } from 'react';
import Particles from '../../components/Particles/Particles';
import './Signup.scss';
import { userService } from './../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedUser } from '../../store/actions/userActions';
import { useHistory } from 'react-router';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

export default function Signup() {
    const emailRef = useRef();
    const passRef = useRef();
    const nameRef = useRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const user = useSelector(state => state.userReducer.user);

    const newSignup = async (ev) => {
        ev.preventDefault();
        const user = await userService.signup(
            nameRef.current.value, emailRef.current.value, passRef.current.value);
        if (user && !user.error) {
            const user = await userService.login(emailRef.current.value, passRef.current.value);
            dispatch(setLoggedUser(user));
            history.push('/');
        }
        else {
            setErrorMsg(user.error);
            setIsError(true);
            var interval = setInterval(() => {
                setIsError(false);
                clearInterval(interval);
            }, 3000)
        }
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <div className="welcome">
            <Particles />
            {user &&
                <div className="flex-center" style={{ marginTop: '2rem', flexDirection: 'column' }}>
                    <p>You are already signed up.</p>
                    <Link to="/" className="btn-link">Return</Link>
                </div>
            }
            {!user &&
                <motion.form className="signup flex-center" onSubmit={newSignup} initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <h1>Signup</h1>
                    <div className="username">
                        <p>Full name:</p>
                        <input type="text" required placeholder="Enter full name..." ref={nameRef} />
                    </div>
                    <div className="email">
                        <p>Email:</p>
                        <input type="email" required placeholder="Enter your email..." ref={emailRef} />
                    </div>
                    <div className="password">
                        <p>Password:</p>
                        <input type="password" required placeholder="Enter new password..." ref={passRef} />
                    </div>
                    <button>Signup</button>
                    {isError && <p className="err">{errorMsg}</p>}
                </motion.form>
            }


        </div>
    )
}
