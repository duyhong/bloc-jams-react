import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './style/main.css';
import './style/App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';
import logo from './assets/images/bloc_jams_logo.png'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <nav className="navbar">
             <Link to='/' className="logo"><img src={logo} alt="bloc jams logo" className="logo" /></Link>
             <div class="links-container">
                <Link to='/library' className="navbar-link">Library</Link>
             </div>
          </nav>
        </header>
        <main>
          <Route exact path="/" component={Landing} />
          <Route path="/library" component={Library} />
          <Route path="/album/:slug" component={Album} />
        </main>
      </div>
    );
  }
}

export default App;
