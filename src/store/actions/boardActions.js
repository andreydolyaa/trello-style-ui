
import { boardService } from './../../services/boardService';

export function loadBoards() {
    return async dispatch => {
        const boards = await boardService.loadBoards();
        dispatch({ type: 'SET_BOARDS', boards });
    }
}

export function loadBoard(boardId) {
    return async dispatch => {
        const board = await boardService.loadBoard(boardId);
        dispatch({ type: 'SET_BOARD', board });
    }
}

export function updateBoard(updatedBoard) {
    return async dispatch => {
        const board = await boardService.update(updatedBoard);
        dispatch({ type: 'UPDATE_BOARD', board });
    }
}

export function moveListToOtherBoard(srcId, destId, list) {
    return async dispatch => {
        const board = await boardService.moveList(srcId, destId, list);
        dispatch({ type: 'MOVE_LIST', board });
    }
}

export function setCurrentCard(card) {
    return dispatch => {
        dispatch({ type: 'SET_CARD', card });
    }
}


export function setCurrentList(list) {
    return dispatch => {
        dispatch({ type: 'SET_LIST', list });
    }
}

export function searchCard(txt, board) {
    return dispatch => {
        dispatch({ type: 'SEARCH_CARD', txt, board });
    }
}



