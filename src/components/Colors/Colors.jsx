import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoard } from '../../store/actions/boardActions';
import './Color.scss';
import { motion } from "framer-motion";

export default function Colors({ setColorPalette }) {
    const globalRef = useRef();
    const dispatch = useDispatch();
    const board = useSelector(state => state.boardReducer.board);

    useEffect(() => {
        document.addEventListener('mousedown', onOutSideClick);
        return () => {
            document.removeEventListener('mousedown', onOutSideClick);
        }
    }, [])

    const onOutSideClick = (ev) => {
        if (globalRef.current && !globalRef.current.contains(ev.target)
            && ev.toElement.outerHTML !== '<p>Color</p>') {
            setColorPalette(false);
        }
    }

    const selectColor = (color) => {
        const newBoard = { ...board };
        newBoard.styles.background = color;
        dispatch(updateBoard(newBoard));
        setColorPalette(false);
    }

    const pageTransition1 = {
        in: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        out: { opacity: 0, y: -10, }
    };

    return (
        <motion.div className="color-menu" ref={globalRef} initial="out" animate="in" exit="out" variants={pageTransition1}>
            <div className="color" style={{ backgroundColor: '#FF9E52' }} onClick={() => selectColor('#FF9E52')}></div>
            <div className="color" style={{ backgroundColor: '#526CFF' }} onClick={() => selectColor('#526CFF')}></div>
            <div className="color" style={{ backgroundColor: '#4C9908' }} onClick={() => selectColor('#4C9908')}></div>
            <div className="color" style={{ backgroundColor: '#089980' }} onClick={() => selectColor('#089980')}></div>

            <div className="color" style={{ backgroundColor: '#96CF39' }} onClick={() => selectColor('#96CF39')}></div>
            <div className="color" style={{ backgroundColor: '#0079BF' }} onClick={() => selectColor('#0079BF')}></div>
            <div className="color" style={{ backgroundColor: '#F05840' }} onClick={() => selectColor('#F05840')}></div>
            <div className="color" style={{ backgroundColor: '#F0C040' }} onClick={() => selectColor('#F0C040')}></div>
            <div className="color" style={{ backgroundColor: '#5540F0' }} onClick={() => selectColor('#5540F0')}></div>
        </motion.div>
    )
}
