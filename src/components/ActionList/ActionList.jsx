

import React, { useEffect, useRef, useState } from 'react';
import { boardService } from '../../services/boardService';
import './ActionList.scss';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { moveListToOtherBoard, updateBoard } from '../../store/actions/boardActions';
import { utils } from '../../services/utils';

export default function ActionList({ list, board, setShowActionList, load, changeBoard, setEditListTitle }) {
    const globalRef = useRef();
    const titleRef = useRef();
    const dispatch = useDispatch();
    const [showNewTitle, setShowNewTitle] = useState(false);
    const [moveList, setMoveList] = useState(false);
    const boards = useSelector(state => state.boardReducer.boards);

    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    useEffect(() => {
    }, [list, board]);

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)) {
            setShowActionList(false);
        }
    }

    const deleteList = async () => {
        var updatedBoard = await boardService.removeList(board, list);
        load();
        changeBoard(updatedBoard._id);
    }

    const closeMenu = () => setShowActionList(false);
    const copyList = () => setShowNewTitle(list => !list);

    const saveCopiedList = () => {
        const listCopy = { ...list };
        const boardCopy = { ...board };
        const listIdx = boardCopy.lists.findIndex(currList => currList._id === list._id);
        listCopy.title = titleRef.current.value;
        listCopy._id = utils.createId();
        boardCopy.lists.splice(listIdx + 1, 0, listCopy);
        dispatch(updateBoard(boardCopy));
        setShowActionList(false);
    }

    const toggleMoveList = () => setMoveList(list => !list);

    const moveListToBoard = async (newBoard) => {
        if (newBoard._id === board._id){
            console.log('same board...');
            return;
        }
        else {
            dispatch(moveListToOtherBoard(board._id, newBoard._id, list));
            load();
        }
    }


    return (
        <div className="action-list" ref={globalRef}>
            <div className="close close-action" onClick={closeMenu}><FiX /></div>
            <div className="title">List actions</div>
            <div onClick={copyList} className="hover-e">Copy this list...</div>

            {showNewTitle &&
                <div className="new-title">
                    <input type="text" ref={titleRef} placeholder="New title..." />
                    <button onClick={saveCopiedList}>Save</button>
                </div>
            }

            <div onClick={toggleMoveList} className="hover-e">Move list to board...</div>
            {moveList &&
                <div className="list-container">
                    <p>Select board...</p>
                    {boards.map(board => {
                        return (
                            <div key={board._id} className="move-list">
                                <p onClick={() => moveListToBoard(board)}>{board.title}</p>
                            </div>
                        )
                    })}
                </div>
            }
            <div className="hover-e" onClick={() => setEditListTitle(list => !list)}>Edit title...</div>
            <div className="hover-e" onClick={deleteList}>Delete this list...</div>
        </div>
    )
}

