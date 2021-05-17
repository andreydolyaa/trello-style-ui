import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RightMenu.scss';
import { imgService } from './../../services/imgService';
import { updateAction, updateBoard } from './../../store/actions/boardActions';
import { motion } from "framer-motion";
import { FiX } from 'react-icons/fi';

export default function RightMenu({ setRightMenu }) {
    const globalRef = useRef();
    const dispatch = useDispatch();
    const board = useSelector(state => state.boardReducer.board);
    const user = useSelector(state => state.userReducer.user);


    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    const setNewBackground = (img) => {
        const newBoard = { ...board };
        newBoard.styles.img = img;
        dispatch(updateBoard(newBoard));
        dispatch(updateAction(board, 'changed the background of this board', user));
    }

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)) {
            setRightMenu(false);
        }
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <motion.div className="right-menu" initial="out" animate="in" exit="out" variants={pageTransition1} ref={globalRef}>
            <FiX className="close-new" onClick={() => setRightMenu(false)} />
            <div className="title">
                <p>Background Images</p>
            </div>

            <motion.div className="imgs-container" initial="out" animate="in" exit="out" variants={pageTransition1}>
                {imgService.imgs().map(img => {
                    return (
                        <div className="menu-img-select" key={img}>
                            <img src={img} onClick={() => setNewBackground(img)}></img>
                        </div>
                    )
                })}
            </motion.div>

            <div className="title" style={{ marginTop: "1rem" }}>
                <p>Board Actions</p>
            </div>
            <div className="actions-container">
                {board.actions.map(action => {
                    return (
                        <div className="action-details flex" key={action.id}>
                            <div style={{ marginRight: "1rem" }} className="name-avatar">{action.user.charAt(0)}</div>
                            <div>
                                <p>{action.user} {action.actionType}</p>
                                <p className="action-time">{action.time}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

// <div className="item-list flex" onClick={() => setShowImgs(img => !img)}>
// <FiImage className="icon-nr" />
// <p>Background Images</p>
// </div>
