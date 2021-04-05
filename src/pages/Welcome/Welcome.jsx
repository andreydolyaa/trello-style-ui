import React from 'react';
import { Link } from 'react-router-dom';
import Particles from '../../components/Particles/Particles';
import './Welcome.scss';
import { motion } from "framer-motion";

export default function Welcome() {
    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };
    return (
        <div className="welcome">
            <Particles />
            <motion.div className="text flex" initial="out" animate="in" exit="out" variants={pageTransition1}>
                <h1>Trevo helps teams move work forward.</h1>
                <p>
                    Collaborate, manage projects, and reach new productivity peaks. from high rises to the home office,
                    the way your team works is unique-accomplish it all with Trevo.
                </p>
                <div className="flex text-second">
                    <Link to="/board" className="start">Start Now</Link>
                    <Link to="/signup" className="start">Signup</Link>
                    <Link to="/login" className="ask">Already a member? Login!</Link>
                </div>
            </motion.div>
        </div>
    )
}


