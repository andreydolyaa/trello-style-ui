import axios from 'axios';


// const BASE_URL = 'http://localhost:3001/api/board';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/board'
    : 'http://localhost:3001/api/board'


export const boardService = {
    loadBoards,
    loadBoard,
    createBoard,
    createList,
    createCard,
    removeList,
    update,
    moveList,
    removeBoard,
    addAction
}


async function loadBoards() {
    const boards = await axios.get(BASE_URL);
    return boards.data;
}

async function loadBoard(boardId) {
    const board = await axios.get(`${BASE_URL}/${boardId}`);
    return board.data;
}

async function createBoard(boardTitle, user) {
    const data = {
        boardTitle,
        user
    }
    var res = await axios.post(`${BASE_URL}`, data);
    return res.data;
}

async function removeBoard(boardId) {
    await axios.delete(`${BASE_URL}/${boardId}`);
}

async function update(board) {
    var data = { board, type: 'board' }
    var res = await axios.put(`${BASE_URL}/${board._id}`, data);
    return res.data;
}

async function createList(listTitle, board, type) {
    var data = {
        listTitle,
        board,
        type
    }
    var res = await axios.put(`${BASE_URL}/${board._id}`, data);
    return res.data;
}

async function createCard(board, list, txt, type) {
    var data = {
        board,
        list,
        txt,
        type
    }
    var res = await axios.put(`${BASE_URL}/${board._id}`, data);
    return res.data;
}


async function removeList(board, list) {
    var listIdx = board.lists.findIndex(currList => currList._id === list._id);
    var boardCopy = { ...board };
    boardCopy.lists.splice(listIdx, 1);
    var data = {
        board: boardCopy,
        type: 'remove'
    }
    var res = await axios.put(`${BASE_URL}/${board._id}`, data);
    return res.data;
}


async function moveList(srcId, destId, list) {
    var oldBoard = await loadBoard(srcId);
    var newBoard = await loadBoard(destId);
    if (oldBoard) {
        var idx = oldBoard.lists.findIndex(currList => currList._id === list._id);
        oldBoard.lists.splice(idx, 1);
        await update(oldBoard);
    }
    if (newBoard) {
        newBoard.lists.unshift(list);
        await update(newBoard);
    }
    return oldBoard;
}

async function addAction(board, action) {
    var oldBoard = await loadBoard(board._id);
    const boardCopy = { ...board };
    if (oldBoard.actions.length <= 50) {
        boardCopy.actions.unshift(action);
    } else {
        boardCopy.actions.splice(oldBoard.action.length, 1, action);
    }
    await update(boardCopy);
    return board;
}