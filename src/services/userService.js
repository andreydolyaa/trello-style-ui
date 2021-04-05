
import axios from 'axios';

// const BASE_URL = 'http://localhost:3001/api/user';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/user'
    : 'http://localhost:3001/api/user'


export const userService = {
    loadUsers,
    signup,
    login
}

async function loadUsers() {
    var res = await axios.get(BASE_URL);
    return res.data;
}

async function signup(fullName, email, password) {
    const data = { fullName, email, password }
    var res = await axios.post(`${BASE_URL}/signup`, data);
    return res.data;

}

async function login(email, password) {
    const data = { email, password };
    const user = await axios.post(`${BASE_URL}/login`, data);
    if(user.data.error) return {error:'Wrong password or email!'};
    else return _handleLogin(user.data);
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
}