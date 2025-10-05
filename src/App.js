import DayList from "./component/DayList";
import Header from "./component/Header";
import Day from "./component/Day"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import EmptyPage from "./component/EmptyPage";
import CreateWord from "./component/CreateWord";
import CreateDay from "./component/CreateDay";
import DeleteDay from "./component/DeleteDay";
function App() {
  return (
    <BrowserRouter>
        <div className ="App">
          <Header />
          <Switch>
            <Route exact path ="/">
              <DayList />
            </Route>
            <Route exact path ="/day/:day">
              <Day />
            </Route>
            <Route path ="/create_word">
              <CreateWord />
            </Route>
            <Route path ="/create_day">
              <CreateDay />
            </Route>
            <Route path = "/delete_day">
              <DeleteDay />
            </Route>
            <Route>
              <EmptyPage />
            </Route>
          </Switch>
        </div>
    </BrowserRouter>
);
}

export default App;
