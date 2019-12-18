import React from 'react';
import './App.css';
import Register from './components/Register'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Add from './components/Add_books';
import Privateroute from './components/Privateroute';

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/">
            <Login />
          </Route>
          <Privateroute exact path='/home' component={Home} />
          <Privateroute exact path='/add_books' component={Add} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
