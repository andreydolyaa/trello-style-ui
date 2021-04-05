import { userService } from "../../services/userService";


export function loadUsers() {
    return async dispatch => {
        const users = await userService.loadUsers();
        dispatch({ type: 'SET_USERS', users });
    }
}

export function setLoggedUser(user) {
    return dispatch => {
        dispatch({ type: 'LOGIN_USER', user })
    }
}

export function logoutUser() {
    return dispatch => {
        dispatch({ type: 'LOGOUT' })
    }
}