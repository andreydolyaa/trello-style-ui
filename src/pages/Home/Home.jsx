
import React, { useEffect, useRef, useState } from 'react';
import './Home.scss';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/List/List';
import { FiPlus } from "react-icons/fi";
import { FiX } from 'react-icons/fi';
import { boardService } from './../../services/boardService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { loadBoard, updateBoard } from '../../store/actions/boardActions';
import ToolPanel from '../../components/ToolPanel/ToolPanel';
import { motion } from "framer-motion";

export default function Home({ load, changeBoard, showBoardsMenu, setMoveCardModal, setCreateBoard,showRightMenu }) {
    const titleRef = useRef();
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);
    const board = useSelector(state => state.boardReducer.board);

    const setEditable = () => setIsEditable(true);

    const stopEditing = (ev) => {
        ev.stopPropagation();
        setIsEditable(false);
    }

    const addNewList = async () => {
        var updatedBoard = await boardService.createList(titleRef.current.value, board, 'list');
        load();
        changeBoard(updatedBoard.board._id);
        setIsEditable(false);
    }


    const listDragEnd = (res) => {
        if (!res.destination) return;
        else {
            const newBoard = { ...board };
            const [srcList] = newBoard.lists.splice(res.source.index, 1);
            newBoard.lists.splice(res.destination.index, 0, srcList);
            dispatch(updateBoard(newBoard));
        }
    }
    // const listDragEnd = (res) => {
    //     if (!res.destination) return;
    //     else {
    //         const boardCopy = [...board.lists];
    //         const newBoard = { ...board };
    //         const [srcList] = boardCopy.splice(res.source.index, 1);
    //         boardCopy.splice(res.destination.index, 0, srcList);
    //         newBoard.lists = boardCopy;
    //         dispatch(updateBoard(newBoard));
    //     }
    // }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return board && (

        <div className="home">
            <ToolPanel showBoardsMenu={showBoardsMenu} load={load} setCreateBoard={setCreateBoard} showRightMenu={showRightMenu} />
            <DragDropContext onDragEnd={listDragEnd}>
                <Droppable droppableId="lists" direction="horizontal" type="column">
                    {(provided) => (
                        <div className="all-lists" {...provided.droppableProps} ref={provided.innerRef}>
                            {board.lists.map((list, index) => {
                                return (
                                    <Draggable draggableId={list._id} key={list._id} index={index}>
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <List list={list} key={list._id}
                                                    board={board}
                                                    load={load}
                                                    changeBoard={changeBoard}
                                                    setMoveCardModal={setMoveCardModal} />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                            <div className="list add" onClick={setEditable}>
                                {!isEditable && <motion.div className="flex add-list" initial="out" animate="in" exit="out" variants={pageTransition1}>
                                    <FiPlus className="icon-nr" />
                                    <p>Add another list</p>
                                </motion.div>}


                                {isEditable &&
                                    <motion.div style={{ position: 'relative' }} className="add" initial="out" animate="in" exit="out" variants={pageTransition1}>
                                        <p>Add list</p>
                                        <div onClick={(ev) => stopEditing(ev)}>
                                            <FiX className="close" />
                                        </div>
                                        <input type="text" placeholder="List title..." ref={titleRef} />
                                        <button onClick={addNewList}>Add</button>
                                    </motion.div>
                                }
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

