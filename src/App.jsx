import { useEffect, useState, userReducer } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import CreateBoard from './components/CreateBoard/CreateBoard';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import { useDispatch, useSelector } from 'react-redux';
import { loadBoard, loadBoards } from './store/actions/boardActions';
import Boards from './components/Boards/Boards';
import MoveCardModal from './components/MoveCard/MoveCardModal';
import { motion } from "framer-motion";
import Welcome from './pages/Welcome/Welcome';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import { setLoggedUser } from './store/actions/userActions';
import Members from './components/Members/Members';
import RightMenu from './components/RightMenu/RightMenu';


function App() {
    const dispatch = useDispatch();
    const [createBoard, setCreateBoard] = useState(false);
    const [moveCard, setMoveCardModal] = useState(false);
    const [boardsDropdown, setBoardsDropdown] = useState(false);
    const [rightMenu, setRightMenu] = useState(false);
    const boards = useSelector(state => state.boardReducer.boards);
    const board = useSelector(state => state.boardReducer.board);
    const user = useSelector(state => state.userReducer.user);


    useEffect(() => {
        load();
    }, [])

    const createNewBoard = () => setCreateBoard(createBoard => !createBoard);
    const showBoardsMenu = () => setBoardsDropdown(boards => !boards);
    const showRightMenu = () => setRightMenu(menu => !menu);
    const changeBoard = (id) => dispatch(loadBoard(id));

    const load = () => {
        dispatch(loadBoards());
    }

    const pageTransition = {
        in: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.2 }
        },
        out: {
            opacity: 0,
            x: "-10%",
        }
    };


    return boards && board && (
        <div style={{ backgroundImage: board.styles.img ? `url(${board.styles.img})` : null, backgroundColor: !board.styles.img ? board.styles.background : null,backgroundRepeat:'no-repeat',backgroundPosition:'center',backgroundAttachment:'fixed' }}>

            {createBoard &&
                <div className="create-board-container">
                    <CreateBoard setCreateBoard={setCreateBoard}
                        user={user}
                        changeBoard={changeBoard} load={load} />
                </div>
            }
            {moveCard &&
                <div className="create-board-container">
                    <MoveCardModal board={board} setMoveCardModal={setMoveCardModal} />
                </div>
            }

            {boardsDropdown &&
                <motion.div className="z-pos" initial="out" animate="in" exit="out" variants={pageTransition}>
                    <Boards boards={boards}
                        changeBoard={changeBoard}
                        closeDropdown={setBoardsDropdown}
                        load={load}
                        board={board} />
                </motion.div>}

            {rightMenu &&
                <div>
                    <RightMenu setRightMenu={setRightMenu}/>
                </div>
            }

            <Router>
                <Navbar
                    user={user}
                    showBoardsMenu={showBoardsMenu} />

                <Switch>
                    <Route exact path="/" render={props => <Welcome {...props} />}></Route>
                    <Route exact path="/signup" render={props => <Signup {...props} />}></Route>
                    <Route exact path="/login" render={props => <Login {...props} />}></Route>
                    <Route exact path="/board" render={props => <Home {...props}
                        load={load}
                        changeBoard={changeBoard}
                        showBoardsMenu={showBoardsMenu}
                        setMoveCardModal={setMoveCardModal}
                        setCreateBoard={setCreateBoard}
                        showRightMenu={showRightMenu}
                    />}>
                    </Route>
                </Switch>
            </Router>

        </div>
    );
}

export default App;
