import React from "react";
import Classnames from "classnames/bind";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
// import css from './index.css'
const css = require("./index.css");
const cs = Classnames.bind(css);

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
