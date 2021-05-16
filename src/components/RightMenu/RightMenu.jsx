import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RightMenu.scss';
import { imgService } from './../../services/imgService';
import { updateBoard } from './../../store/actions/boardActions';
import { motion } from "framer-motion";
import { FiImage } from 'react-icons/fi';

export default function RightMenu() {
    const dispatch = useDispatch();
    const [showImgs, setShowImgs] = useState(false);
    const board = useSelector(state => state.boardReducer.board);


    const setNewBackground = (img) => {
        const newBoard = { ...board };
        newBoard.styles.img = img;
        dispatch(updateBoard(newBoard));
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <motion.div className="right-menu" initial="out" animate="in" exit="out" variants={pageTransition1}>
            <div className="title">
                <p>Board Options</p>
            </div>
            <div className="item-list flex" onClick={() => setShowImgs(img => !img)}>
                <FiImage className="icon-nr" />
                <p>Background Images</p>
            </div>
            {showImgs &&
                <motion.div className="imgs-container" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    {imgService.imgs().map(img => {
                        return (
                            <div className="menu-img-select" key={img}>
                                <img src={img} onClick={() => setNewBackground(img)}></img>
                            </div>
                        )
                    })}
                </motion.div>
            }
        </motion.div>
    )
}
