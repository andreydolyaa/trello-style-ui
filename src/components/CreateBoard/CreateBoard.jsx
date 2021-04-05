

import React, { useEffect, useRef } from 'react';
import './CreateBoard.scss';
import { FiTrello, FiX } from 'react-icons/fi';
import { boardService } from './../../services/boardService';
import { motion } from "framer-motion";

export default function CreateBoard({ setCreateBoard, user, changeBoard, load }) {
    const titleRef = useRef();
    const globalRef = useRef();

    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    const createNewBoard = async () => {
        var board = await boardService.createBoard(titleRef.current.value, user);
        setCreateBoard(false);
        load();
        changeBoard(board._id);
    }

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)) {
            setCreateBoard(false);
        }
    }

    const pageTransition = {
        in: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 }
        },
        out: {
            opacity: 0,
            x:"-10%"
        }
    };

    return (
        
           
                <motion.div className="create-board" ref={globalRef} initial="out" animate="in" exit="out" variants={pageTransition}>
                    <div className="close" onClick={() => setCreateBoard(false)}><FiX /></div>
                    <div className="flex-center">
                        <FiTrello className="icon-nr" />
                        <p>Create Board</p>
                    </div>
                    <div className="flex">
                        <p>Board Title:</p>
                        <input type="text" ref={titleRef} defaultValue="New Board" />
                    </div>
                    <div>
                        <button onClick={createNewBoard}>Create</button>
                    </div>
                </motion.div>
           
        
    )
}
