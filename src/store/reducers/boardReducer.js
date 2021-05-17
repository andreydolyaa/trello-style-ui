import IMG from '../../assets/profile img.jpg';
import { updateBoard } from './../actions/boardActions';

const INITIAL_STATE = {
    boards: [],
    board: null,
    card: null,
    list: null,
}

export function boardReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_BOARDS': {
            return {
                ...state,
                boards: action.boards,
                board: !state.board ? state.board = action.boards[0] : state.board
            }
        }
        case 'SEARCH_CARD': {
            const newBoard = { ...state.board };
            const findSearch = state.board.lists.filter(list =>
                list.cards.find(card =>
                    card.title.toLowerCase().includes(action.txt)));
            newBoard.lists = findSearch;
            return {
                ...state,
                board: newBoard
            }
        }
        case 'SET_BOARD': {
            return {
                ...state,
                board: action.board
            }
        }
        case 'UPDATE_BOARD': {
            return {
                ...state,
                board: action.board
            }
        }
        case 'MOVE_LIST': {
            return {
                ...state,
                board: action.board
            }
        }
        case 'SET_CARD': {
            return {
                ...state,
                card: action.card
            }
        }
        case 'SET_LIST': {
            return {
                ...state,
                list: action.list
            }
        }
        case 'SET_ACTION': {
            return {
                ...state,
                board: action.updatedBoard
            }
        }
        default:
            return state;
    }
}