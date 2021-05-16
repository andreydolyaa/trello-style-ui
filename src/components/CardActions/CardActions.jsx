

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { utils } from '../../services/utils';
import { setCurrentCard, setCurrentList, updateBoard } from '../../store/actions/boardActions';
import './CardActions.scss';
import { motion } from "framer-motion";
import { FiX } from 'react-icons/fi';


export default function CardActions({ card, board, list, setShowEditCard, setShowCardActions, setMoveCardModal, setShowIcon }) {
    const dispatch = useDispatch();
    const imageRef = useRef();
    const [showColors, setShowColors] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showLabels, setShowLabels] = useState(false);

    useEffect(() => {
    }, [card, board, list]);

    const deleteCard = () => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        updatedBoard.lists[listIdx].cards.splice(cardIdx, 1);
        dispatch(updateBoard(updatedBoard));
        setShowIcon(false);
    }

    const copyCard = () => {
        const updatedBoard = { ...board };
        const cardCopy = { ...card };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        cardCopy._id = utils.createId();
        updatedBoard.lists[listIdx].cards.splice(cardIdx + 1, 0, cardCopy);
        doUpdate(updatedBoard);
    }


    const selectColor = (color) => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        updatedBoard.lists[listIdx].cards[cardIdx].styles.background = color;
        doUpdate(updatedBoard);
    }

    const setCard = () => {
        setMoveCardModal(modal => !modal);
        setShowCardActions(false);
        dispatch(setCurrentCard(card));
        dispatch(setCurrentList(list));
        setShowIcon(false);
    }

    const uploadImage = () => {
        const imageUrl = imageRef.current.value;
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        updatedBoard.lists[listIdx].cards[cardIdx].img = imageUrl;
        doUpdate(updatedBoard);
    }

    const doUpdate = (board) => {
        dispatch(updateBoard(board));
        setShowCardActions(false);
        setShowIcon(false);
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    const setLabel = (label) => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        if (updatedBoard.lists[listIdx].cards[cardIdx].labels.some(l => l.labelColor === label)) return;
        else {
            updatedBoard.lists[listIdx].cards[cardIdx].labels.push({ id: utils.createId(), labelColor: label });
            doUpdate(updatedBoard);
        }
    }

    return (
        <div className="card-actions">
            <FiX className="close" style={{ margin: '3px' }} onClick={() => { setShowCardActions(false); setShowIcon(false) }} />
            <div className="title">Card actions</div>
            <div className="option" onClick={deleteCard}>Delete this card</div>
            <div className="option" onClick={() => setShowEditCard(card => !card)}>Edit this card</div>
            <div className="option" onClick={() => setShowLabels(label => !label)}>Add Label</div>


            {showLabels &&
                <motion.div initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <div className="color" style={{ backgroundColor: '#86E42E' }} onClick={() => setLabel('#86E42E')}></div>
                    <div className="color" style={{ backgroundColor: '#FCDD53' }} onClick={() => setLabel('#FCDD53')}></div>
                    <div className="color" style={{ backgroundColor: '#FF5757' }} onClick={() => setLabel('#FF5757')}></div>
                </motion.div>
            }


            <div className="option" onClick={() => setShowColors(color => !color)}>Color this card</div>

            {showColors && <motion.div initial="out" animate="in" exit="out" variants={pageTransition1}>
                <div className="color" style={{ backgroundColor: '#F8D086' }} onClick={() => selectColor('#F8D086')}></div>
                <div className="color" style={{ backgroundColor: '#94F7A9' }} onClick={() => selectColor('#94F7A9')}></div>
                <div className="color" style={{ backgroundColor: '#86CEF8' }} onClick={() => selectColor('#86CEF8')}></div>
                <div className="color" style={{ backgroundColor: '#AF86F8' }} onClick={() => selectColor('#AF86F8')}></div>
                <div className="color" style={{ backgroundColor: '#FC5757' }} onClick={() => selectColor('#FC5757')}></div>
                <div className="color" style={{ backgroundColor: '#fff' }} onClick={() => selectColor('#fff')}></div>
            </motion.div>}

            <div className="option" onClick={setCard}>Move to other list</div>
            <div className="option" onClick={copyCard}>Copy this card</div>

            <div className="option" onClick={() => setIsUploading(img => !img)}>Add image</div>

            {isUploading &&
                <motion.div className="img-upload" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <input type="text" placeholder="Image url..." ref={imageRef} />
                    <button onClick={uploadImage}>Add</button>
                </motion.div>
            }


        </div>
    )
}
