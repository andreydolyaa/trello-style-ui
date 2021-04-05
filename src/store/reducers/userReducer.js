var localLoggedInUser = null;
if (sessionStorage.user) localLoggedInUser = JSON.parse(sessionStorage.user);

const INITIAL_STATE = {
    users: [],
    user: localLoggedInUser,
}

export function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_USERS': {
            return {
                ...state,
                users: action.users
            }
        }
        case 'LOGIN_USER': {
            return {
                ...state,
                user: action.user
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                user: null
            }
        }
        default:
            return state;
    }
}