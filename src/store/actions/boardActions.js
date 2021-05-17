
import { boardService } from './../../services/boardService';
import { utils } from './../../services/utils';
import moment from 'moment';

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

export function updateAction(board, actionType, user) {
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    return async dispatch => {
        const action = {
            id: utils.createId(),
            user: user ? user.fullName : 'Anonymous',
            time,
            actionType
        }
        const updatedBoard = await boardService.addAction(board, action);
        dispatch({ type: 'SET_ACTION', updatedBoard });
    }
}


// export function createNewCard(board,list,val,type){
//     return async dispatch => {
//         var updatedBoard = await boardService.createCard(board, list, val, type);
//         dispatch({type:'SET_NEW_CARD',updatedBoard});
//     }
// }
