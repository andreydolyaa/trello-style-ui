import React, { useEffect, useRef, useState } from 'react';
import './Card.scss';
import { VscEdit } from "react-icons/vsc";
import CardActions from '../CardActions/CardActions';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { updateAction, updateBoard } from '../../store/actions/boardActions';
import { motion } from "framer-motion";
import { userReducer } from './../../store/reducers/userReducer';

export default function Card({ card, board, list, setMoveCardModal }) {
    const globalRef = useRef();
    const newTitleRef = useRef();
    const dispatch = useDispatch();
    const [showIcon, setShowIcon] = useState(false);
    const [showCardActions, setShowCardActions] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);
    const user = useSelector(state => state.userReducer.user);


    useEffect(() => {
    }, [card, board, list])


    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])


    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)) {
            setShowCardActions(false);
        }
    }

    const saveEditedCard = () => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        updatedBoard.lists[listIdx].cards[cardIdx].title = newTitleRef.current.value;
        dispatch(updateBoard(updatedBoard));
        setShowEditCard(false);
        setShowCardActions(false);
        setShowIcon(false);
    }

    const removeImage = () => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        delete updatedBoard.lists[listIdx].cards[cardIdx].img;
        dispatch(updateBoard(updatedBoard));
    }

    const removeLabel = (labelId) => {
        const updatedBoard = { ...board };
        const listIdx = updatedBoard.lists.findIndex(currList => currList._id === list._id);
        const cardIdx = list.cards.findIndex(currCard => currCard._id === card._id);
        const labelIdx = updatedBoard.lists[listIdx].cards[cardIdx].labels.findIndex(label => label.id === labelId);
        updatedBoard.lists[listIdx].cards[cardIdx].labels.splice(labelIdx,1);
        dispatch(updateBoard(updatedBoard));
        dispatch(updateAction(board, 'removed a label', user));
    }


    const pageTransition = {
        in: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 }
        },
        out: {
            opacity: 0,
            x: "-10%"
        }
    };
    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        out: { opacity: 0, y: -10, }
    };
    const pageTransition2 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <motion.div className="card" onMouseEnter={() => setShowIcon(true)} onMouseLeave={() => setShowIcon(false)}
            ref={globalRef}
            style={{ backgroundColor: card.styles.background }} initial="out" animate="in" exit="out" variants={pageTransition2}>
            {showEditCard &&
                <motion.div className="edit-card" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <textarea defaultValue={card.title} ref={newTitleRef}></textarea>
                    {card.img && <div className="img-container flex-center">
                        <img src={card.img}></img>
                        <div className="delete-image" onClick={removeImage}>Delete image</div>
                    </div>}
                    <div className="flex">
                        <button onClick={saveEditedCard}>Save</button>
                        <FiX className="icon-close"
                            onClick={() => { setShowEditCard(false); setShowCardActions(false); setShowIcon(false) }} />
                    </div>
                </motion.div>
            }
            {!showEditCard &&
                <div>
                    <div className="labels">
                        {card.labels.map(label => {
                            return (
                                <div className="label" style={{ backgroundColor: label.labelColor }} onClick={()=>removeLabel(label.id)} key={label.id}>
                                </div>
                            )

                        })}
                    </div>
                    <div className="img-container flex-center">
                        {card.img &&
                            <img src={card.img}></img>
                        }
                    </div>
                    <p className="card-text" style={{marginTop: card.labels.length ? '5px' : null}}>{card.title}</p>
                </div>
            }
            {showIcon &&
                <div className="card-options flex" onClick={() => setShowCardActions(card => !card)}>
                    <VscEdit style={{ color: '#484848', fontSize: '14px' }} />
                </div>
            }
            <div className="card-options-mobile flex" onClick={() => setShowCardActions(card => !card)}>
                <VscEdit style={{ color: '#484848', fontSize: '14px' }} />
            </div>
            {showCardActions &&
                <motion.div className="card-menu" initial="out" animate="in" exit="out" variants={pageTransition}>
                    <CardActions
                        card={card}
                        board={board}
                        list={list}
                        setShowEditCard={setShowEditCard}
                        setShowCardActions={setShowCardActions}
                        setMoveCardModal={setMoveCardModal}
                        setShowIcon={setShowIcon} />
                </motion.div>
            }
        </motion.div>
    )
}
