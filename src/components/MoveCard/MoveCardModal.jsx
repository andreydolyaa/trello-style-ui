import React, { useEffect, useRef, useState } from 'react';
import './MoveCardModal.scss';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { updateBoard } from '../../store/actions/boardActions';

export default function MoveCardModal({ board, setMoveCardModal }) {
    const listRef = useRef();
    const dispatch = useDispatch();
    const card = useSelector(state => state.boardReducer.card);
    const list = useSelector(state => state.boardReducer.list);

    useEffect(() => {
    }, [board]);

    const moveCard = () => {
        const listToMoveId = listRef.current.value;
        const boardCopy = { ...board };
        const listIdx = boardCopy.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = boardCopy.lists[listIdx].cards.findIndex(currCard => currCard._id === card._id);
        const [cardToMove] = boardCopy.lists[listIdx].cards.splice(cardIdx, 1);
        const newListIdx = boardCopy.lists.findIndex(currList => currList._id === listToMoveId);
        boardCopy.lists[newListIdx].cards.unshift(cardToMove);
        dispatch(updateBoard(boardCopy));
        setMoveCardModal(false);
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <motion.div className="move-card-modal create-board" initial="out" animate="in" exit="out" variants={pageTransition1}>
            <FiX className="close" onClick={() => setMoveCardModal(false)} style={{margin:'5px'}}/>
            <p>Select list to move card</p>
            <select ref={listRef}>
                {board.lists.map(list => {
                    return <option key={list._id} value={list._id}>{list.title}</option>
                })}
            </select>
            <button onClick={moveCard}>Move card</button>
        </motion.div>
    )
}
