

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Members.scss';
import { loadUsers } from './../../store/actions/userActions';
import { updateBoard } from './../../store/actions/boardActions';
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

export default function Members({ setIsMembers }) {
    const dispatch = useDispatch();
    const globalRef = useRef();
    const [toggleSearchUsers, setToggleSearchUsers] = useState(false);
    const board = useSelector(state => state.boardReducer.board);
    const users = useSelector(state => state.userReducer.users);

    useEffect(() => {
        dispatch(loadUsers());
    }, [])

    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    const addMemberToBoard = (user) => {
        const boardCopy = { ...board };
        const check = boardCopy.members.some(member => member.email === user.email);
        if (check) return;
        else {
            boardCopy.members.push(user);
            dispatch(updateBoard(boardCopy));
        }
    }

    const removeMember = (member) => {
        const boardCopy = { ...board };
        const memberIdx = boardCopy.members.findIndex(currMember => currMember._id === member._id);
        boardCopy.members.splice(memberIdx, 1);
        dispatch(updateBoard(boardCopy));
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)
            && ev.toElement.outerHTML !== '<p>Board members</p>') {
            setToggleSearchUsers(false);
            setIsMembers(false);
        }
    }

    return (
        <motion.div className="members" initial="out" animate="in" exit="out" variants={pageTransition1} ref={globalRef}>

            <p className="title">Board Members</p>
            <div className="curr-members">
                {board.members.map(member => {
                    return (
                        <div key={member._id} className="user-container">
                            <p className="curr-user">{member.fullName}</p>
                            <p className="curr-user email">{member.email}</p>
                            <p className="icon-add" onClick={() => removeMember(member)}>x</p>
                        </div>
                    )
                })}
            </div>

            <div className="search" onClick={() => setToggleSearchUsers(search => !search)}><p>Search for new users</p><FiChevronDown/></div>

            {users && toggleSearchUsers &&
                <motion.div className="curr-members" initial="out" animate="in" exit="out" variants={pageTransition1}>
                    {users.map(user => {
                        return (
                            <div key={user._id} className="user-container">
                                <p className="curr-user">{user.fullName}</p>
                                <p className="curr-user email">{user.email}</p>
                                <p className="icon-add" onClick={() => addMemberToBoard(user)}>+</p>
                            </div>
                        )
                    })}
                </motion.div>
            }



        </motion.div>
    )
}
