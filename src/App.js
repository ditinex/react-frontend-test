/* eslint-disable */ 

import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './components/Home'
import Insight from './components/Insight';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
        <div>
          <nav>
            <ul>
            </ul>
          </nav>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/insight/:userId">
              <Insight />
            </Route>
            <Route>
              <div>Default Page</div>
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
