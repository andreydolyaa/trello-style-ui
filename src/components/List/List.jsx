import React, { useEffect, useRef, useState } from 'react';
import Card from '../Card/Card';
import './List.scss';
import { FiX, FiCheck } from 'react-icons/fi';
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { boardService } from './../../services/boardService';
import ActionList from '../ActionList/ActionList';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../../store/actions/boardActions';
import { motion } from "framer-motion";



export default function List({ list, board, load, changeBoard, setMoveCardModal }) {
    const cardRef = useRef();
    const newTitleRef = useRef();
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);
    const [showActionList, setShowActionList] = useState(false);
    const [editListTitle, setEditListTitle] = useState(false);


    useEffect(() => {
    }, [list, board])

    const setEditable = () => {
        setIsEditable(true);
    }
    const stopEditing = (ev) => {
        ev.stopPropagation();
        setIsEditable(false);
    }

    const toggleActionList = () => {
        setShowActionList(list => !list);
    }

    const addNewCard = async () => {
        if (!cardRef.current.value) return;
        var updatedBoard = await boardService.createCard(board, list, cardRef.current.value, 'card');
        load();
        changeBoard(updatedBoard.board._id);
    }

    const cardDragEnd = (res) => {
        if (!res.destination) return;
        else {
            const boardCopy = { ...board };
            const listIdx = boardCopy.lists.findIndex(currList => currList._id === list._id);
            const [srcCard] = boardCopy.lists[listIdx].cards.splice(res.source.index, 1);
            boardCopy.lists[listIdx].cards.splice(res.destination.index, 0, srcCard);
            dispatch(updateBoard(boardCopy));
        }
    }

    const saveNewTitle = () => {
        const boardCopy = { ...board };
        const listIdx = boardCopy.lists.findIndex(currList => currList._id === list._id);
        boardCopy.lists[listIdx].title = newTitleRef.current.value;
        dispatch(updateBoard(boardCopy));
        setEditListTitle(false);
    }

    const pageTransition = {
        in: { opacity: 1, x: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, x: "-10%", }
    };
    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    // const handleKey = (ev) => {
    //     // charCode: 13
    //     if (ev.charCode === 13) {
    //         cardRef.current.value += '\n'
    //     }

    // }

    return (
        <div className="list">
            <DragDropContext onDragEnd={cardDragEnd}>
                <Droppable droppableId="cards" direction="vertical" type="row">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            <div className="title flex">
                                {!editListTitle &&
                                    <div className="flex">
                                        <p className="icon-regular" onClick={() => setEditListTitle(list => !list)}>{list.title}</p>
                                    </div>
                                }
                                {editListTitle &&
                                    <div className="flex icon-regular">
                                        <input type="text" defaultValue={list.title} ref={newTitleRef} className="edit-title" />
                                        <div className="edit-icons">
                                            <FiCheck style={{ marginLeft: '5px' }} className="icon-nr icon-regular icon-hov" onClick={saveNewTitle} />
                                            <FiX className="icon-regular icon-hov" onClick={() => setEditListTitle(false)} />
                                        </div>
                                    </div>
                                }
                                <div onClick={toggleActionList} className="action-btn flex">
                                    <FiMoreHorizontal className="icon-regular" />
                                </div>
                            </div>

                            {list.cards.map((card, index) => {
                                return (
                                    <Draggable key={card._id} draggableId={card._id} index={index}>
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <Card card={card} key={card._id}
                                                    board={board}
                                                    list={list}
                                                    setMoveCardModal={setMoveCardModal} />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}


                            {!isEditable &&
                                <motion.div className="flex pre-edit" onClick={setEditable} initial="out" animate="in" exit="out" variants={pageTransition1}>
                                    <FiPlus className="icon-nr" />
                                    <p>Add Another card</p>
                                </motion.div>
                            }


                            {isEditable &&
                                <motion.div className="edit" initial="out" animate="in" exit="out" variants={pageTransition1}>
                                    <textarea ref={cardRef} placeholder="Write something..."/>
                                    <div className="flex">
                                        <button onClick={addNewCard}>Add card</button>
                                        <div onClick={(ev) => stopEditing(ev)} className="icon-in flex">
                                            <FiX />
                                        </div>
                                    </div>
                                </motion.div>
                            }
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {showActionList &&
                <motion.div className="options" initial="out" animate="in" exit="out" variants={pageTransition}>
                    <ActionList list={list}
                        board={board}
                        setShowActionList={setShowActionList}
                        load={load}
                        changeBoard={changeBoard}
                        setEditListTitle={setEditListTitle} />
                </motion.div>
            }
        </div>
    )
}
