
import React, { useEffect, useRef, useState } from 'react';
import './ToolPanel.scss';
import { VscPreview } from "react-icons/vsc";
import { FiChevronDown, FiImage, FiUsers } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../Colors/Colors';
import { BiStar } from "react-icons/bi";
import { loadBoard, searchCard, updateBoard } from '../../store/actions/boardActions';
import { HiPlus } from "react-icons/hi";
import { FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { motion } from "framer-motion";
import Members from './../Members/Members';

export default function ToolPanel({ showBoardsMenu, load, setCreateBoard }) {
    const dispatch = useDispatch();
    const titleRef = useRef();
    const searchRef = useRef();
    const [showColorPalette, setColorPalette] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isMembers, setIsMembers] = useState(false);
    const board = useSelector(state => state.boardReducer.board);



    useEffect(() => {
        load();
    }, [board])

    const toggleColorPalette = (ev) => {
        setColorPalette(palette => !palette);
    }

    const starBoard = () => {
        const boardCopy = { ...board };
        if (boardCopy.isStarred) boardCopy.isStarred = false;
        else boardCopy.isStarred = true;
        dispatch(updateBoard(boardCopy));
    }

    const closeEdit = (ev) => {
        ev.stopPropagation();
        setEditTitle(false);
    }

    const changeBoardTitle = (ev) => {
        ev.stopPropagation();
        if (!titleRef.current.value) return;
        const updatedBoard = { ...board };
        updatedBoard.title = titleRef.current.value;
        dispatch(updateBoard(updatedBoard));
        setEditTitle(false);
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    const handleSearch = () => {
        if (searchRef.current.value) {
            dispatch(searchCard(searchRef.current.value, board));
        }
        else {
            dispatch(loadBoard(board._id));
        }
    }

    const resetSearch = () => {
        setIsSearch(false);
        searchRef.current.value = '';
        dispatch(loadBoard(board._id));
    }

    return (
        <div className="tool-panel flex">

            <div className="btn flex-center title-edit" onClick={() => setEditTitle(true)}>
                {!editTitle && <div>
                    <p>{board.title}</p>
                </div>}

                {editTitle && <motion.div className="flex" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <input type="text" placeholder="Set new title..." ref={titleRef} defaultValue={board.title} />
                    <div className="flex">
                        <FiCheck style={{ marginLeft: '5px' }} className="icon-hov" onClick={changeBoardTitle} />
                        <div onClick={closeEdit} className="flex">
                            <FiX style={{ marginLeft: '5px' }} className="icon-hov" />
                        </div>
                    </div>
                </motion.div>}

            </div>



            <div onClick={showBoardsMenu} className="btn btn-hover flex-center">
                <VscPreview />
                <p>Boards</p>
                <FiChevronDown />
            </div>


            <div onClick={() => setCreateBoard(true)} className="btn btn-hover flex-center">
                <p>Create board</p>
                <HiPlus />
            </div>

            <div className="color-container">
                <div className="btn btn-hover flex-center" onClick={toggleColorPalette}>
                    <FiImage />
                    <p>Color</p>
                    <FiChevronDown />
                </div>
                {showColorPalette &&
                    <div className="color-palette">
                        <Colors setColorPalette={setColorPalette} />
                    </div>
                }
            </div>
            <div className="btn btn-hover" onClick={starBoard}>
                <BiStar style={{ fontSize: '1.35rem', color: board.isStarred ? 'yellow' : null }} />
            </div>


            <div className="btn btn-hover members-container">
                <div onClick={() => setIsMembers(mem => !mem)} className="flex-center">
                    <FiUsers />
                    <p>Board members</p>
                    <FiChevronDown />
                </div>

                {isMembers &&
                    <div className="member">
                        <Members setIsMembers={setIsMembers} />
                    </div>
                }
            </div>

            {!isSearch &&
                <div className="btn btn-hover flex" onClick={() => setIsSearch(true)}>
                    <p>Search card</p>
                    <FiSearch className="icon-nr" />
                </div>
            }
            {isSearch &&
                <motion.div className="flex search-input" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    <input type="text" onChange={handleSearch} ref={searchRef} placeholder="Search card..." />
                    <FiX className="icon-search" onClick={resetSearch} />
                </motion.div>
            }


        </div>
    )
}
