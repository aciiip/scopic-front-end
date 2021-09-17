import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home/Home";
import Detail from "./pages/Detail/Detail";
import Login from "./pages/Login/Login";
import Setting from "./pages/Setting/Setting";

function App() {
    if (!localStorage.getItem('token') && window.location.pathname !== '/login') {
        window.location = '/login'
    }
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={'/'} component={Home}/>
                <Route path={'/detail/:id'} component={Detail}/>
                <Route path={'/login'} component={Login}/>
                <Route path={'/setting'} component={Setting}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
