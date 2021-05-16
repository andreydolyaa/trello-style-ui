import React, { useEffect, useRef, useState } from 'react';
import { BiStar, BiTime, BiTrash } from "react-icons/bi";
import './Boards.scss';
import { FiX } from 'react-icons/fi';
import { updateBoard } from '../../store/actions/boardActions';
import { useDispatch } from 'react-redux';
import { boardService } from '../../services/boardService';


export default function Boards({ boards, changeBoard, closeDropdown, load, board }) {
    const globalRef = useRef();
    const dispatch = useDispatch();
    const [numOfStarredBoards, setNumOfStarredBoards] = useState(0);

    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    useEffect(() => {
        countStarredBoards();
    }, [])

    useEffect(() => {
        load();
    }, [board])

    const handleChangeBoard = (id) => {
        changeBoard(id);
        closeDropdown(false);
    }

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)
            && ev.toElement.outerHTML !== '<p>Boards</p>') {
            closeDropdown(false);
        }
    }

    const closeMenu = () => closeDropdown(false);

    const countStarredBoards = () => {
        var count = 0;
        boards.forEach(board => board.isStarred ? count++ : null);
        setNumOfStarredBoards(count);
    }

    const removeStarred = (ev, board) => {
        ev.stopPropagation();
        const boardCopy = { ...board };
        boardCopy.isStarred = false;
        dispatch(updateBoard(boardCopy));
    }

    const deleteBoard = async (ev, boardId) => {
        ev.stopPropagation();
        if (boardId !== boards[0]._id) {
            await boardService.removeBoard(boardId);
            load();
            changeBoard(boards[0]._id);
        }
    }

    return (
        <div className="boards-dropdown" ref={globalRef}>
            <FiX className="close" style={{ margin: '5px' }} onClick={closeMenu} />
            <div className="starred">
                <div className="flex title">
                    <BiStar className="icon-nr" />
                    <p>Starred boards</p>
                </div>
                {numOfStarredBoards <= 0 ?
                    <div className="no-boards">
                        <p>Star your most important boards to keep them right at your fingertips.</p>
                    </div>

                    :
                    <div>
                        {boards.map(board => {
                            return board.isStarred && (
                                <div className="boards-list flex" key={board._id} onClick={() => handleChangeBoard(board._id)}>
                                    <div className="flex">
                                        <div className="board-color" style={{ backgroundColor: board.styles.background }}></div>
                                        <p >{board.title}</p>
                                    </div>
                                    <div className="trash flex" onClick={(ev) => removeStarred(ev, board)}><BiTrash /></div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>

            <div>
                <div className="timer">
                    <div className="flex title">
                        <BiTime className="icon-nr" />
                        <p>Recent boards</p>
                    </div>
                </div>

                <div>
                    {boards.map(board => {
                        return (
                            <div className="boards-list flex" onClick={() => handleChangeBoard(board._id)} key={board._id} >
                                <div className="flex">
                                    <div className="board-color" style={{ backgroundImage: board.styles.img ? `url(${board.styles.img})` : null, backgroundColor: !board.styles.img ? board.styles.background : null, backgroundSize: "2rem", backgroundRepeat: 'no-repeat' }}></div>
                                    <p>{board.title}</p>
                                </div>
                                <div className="del-list">
                                    <FiX className="flex" onClick={(ev) => deleteBoard(ev, board._id)} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
