
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Particles from '../../components/Particles/Particles';
import { userService } from '../../services/userService';
import { setLoggedUser } from '../../store/actions/userActions';
import { motion } from "framer-motion";
import './Login.scss';
import { Link } from 'react-router-dom';

export default function Login() {
    const emailRef = useRef();
    const passRef = useRef();
    const history = useHistory();
    const dispatch = useDispatch();
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const user = useSelector(state => state.userReducer.user);

    const newLogin = async () => {
        const user = await userService.login(emailRef.current.value, passRef.current.value);
        if (user && !user.error) {
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
                <div className="flex-center" style={{ marginTop: '2rem',flexDirection:'column' }}>
                    <p>You are already logged in.</p>
                    <Link to="/" className="btn-link">Return</Link>
                </div>
            }
            {!user &&
                <motion.div className="login flex-center" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <h1>Login</h1>
                    <div className="email">
                        <p>Email:</p>
                        <input type="email" placeholder="Enter your email..." ref={emailRef} defaultValue="test@trevo.com" />
                    </div>
                    <div className="password">
                        <p>Password:</p>
                        <input type="password" placeholder="Enter your password..." ref={passRef} defaultValue="123" />
                    </div>
                    <button onClick={newLogin}>Login</button>
                    {isError && <p className="err">{errorMsg}</p>}
                </motion.div>
            }
        </div>
    )
}
