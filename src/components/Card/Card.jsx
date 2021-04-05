import React, { useEffect, useRef, useState } from 'react';
import './Card.scss';
import { VscEdit } from "react-icons/vsc";
import CardActions from '../CardActions/CardActions';
import { FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../../store/actions/boardActions';
import { motion } from "framer-motion";

export default function Card({ card, board, list, setMoveCardModal }) {
    const globalRef = useRef();
    const newTitleRef = useRef();
    const dispatch = useDispatch();
    const [showIcon, setShowIcon] = useState(false);
    const [showCardActions, setShowCardActions] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);


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
                    <div className="flex">
                        <button onClick={saveEditedCard}>Save</button>
                        <FiX className="icon-close"
                            onClick={() => { setShowEditCard(false); setShowCardActions(false); setShowIcon(false) }} />
                    </div>
                </motion.div>
            }
            {!showEditCard &&
                <div>
                    <p>{card.title}</p>
                </div>
            }
            {showIcon &&
                <div className="card-options flex" onClick={() => setShowCardActions(card => !card)}>
                    <VscEdit style={{ color: '#484848', fontSize: '14px' }} />
                </div>
            }
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
