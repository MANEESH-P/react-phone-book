import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import AddContact from "./containers/AddContact";
import Favourites from "./containers/Favourites";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/addContact" component={AddContact} />
          <Route exact path="/favourites" component={Favourites} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
