import {BrowserRouter, Route, Switch} from "react-router-dom";
import Header from "./component/Header";
import Home from "./component/Home"
import Login from "./component/Login";
import Logout from "./component/Logout";
function App() {
    return (
        <BrowserRouter>
            <div className ="App">
            <Header />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/Login">
                    <Login />
                </Route>
                <Route exact path="/">
                    <Logout />
                </Route>
                
            </Switch>
        </div>
        </BrowserRouter>
    )
}

export default App; 