import React, { Component } from 'react';
import { BrowserRouter,Route } from 'react-router-dom';
import { PATH_POPULAR, PATH_TOP_RATED, PATH_UPCOMING, PATH_WATCHLIST } from './api';
import Header from './components/Header';
import Main from './components/Main';
import Discover from './components/Discover';
import WatchList from './components/WatchList';
import SearchResults from './components/SearchResults';
import { NavLink } from 'react-router-dom';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      favorites: {},
      watchLater: {},
      ...this.defaulFilterstState
    };
  }

  defaulFilterstState = {
    filters: {     
      sort_by: {
        value: 'vote_average',
        label: 'Rating'
      },
      order: {
        value: 'desc',
        label: 'Descending'
      },
      year: new Date().getFullYear()
    }
  } 

  updateStateWithFilters = (filters) => this.setState({ filters })

  resetFilters = () => this.setState(this.defaultState)

  render() {
    return (
      <BrowserRouter>
        <div className="App">        
          <div className="App-sidebar-wrapper"> 
            <div className="left-sidebar-menu">
              <NavLink exact={true} to="/" activeClassName="is-active">
                <i class="fa fal fa-bars"></i>
              </NavLink>
            </div>
            <div className="left-sidebar-menu">
              <NavLink exact={true} to="/watchList" activeClassName="is-active">
                <i class="fa fa-star-o"></i>
              </NavLink>   
            </div>         
          </div>
          <div className="App-content-wrapper">
            <Header
              user={this.state.user} filters={this.state.filters}
              updateFilters={this.updateStateWithFilters}
              resetFilters={this.resetFilters}
            />
            <Route exact path="/"
              render={()=><Discover
                title="Discover"
                updateFilters={this.updateStateWithFilters}
                filters={this.state.filters} />}
             />
            <Route exact path="/popular"
              render={()=><Main
                title="Popular"
                section={PATH_POPULAR} />}
            />
            <Route exact path="/top-rated"
              render={()=><Main
                title="Top Rated"
                section={PATH_TOP_RATED}  />}
            />
            <Route exact path="/coming-soon"
              render={()=><Main
                title="Coming Soon"
                section={PATH_UPCOMING}  />}
            />
            <Route exact path="/watchList"
              render={()=><WatchList
                title="Watch List"
                section={PATH_WATCHLIST}  />}
            />
            <Route path="/search" component={SearchResults}/>            
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
