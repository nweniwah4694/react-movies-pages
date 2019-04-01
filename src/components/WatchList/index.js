import React, { Component } from 'react';
import './index.css';

class WatchList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      movie: {
        release_date: '',
        genres: [],
      }
    };
  } 

  removeWatchList(movieId) {
    // get current list of items
    const watchList = JSON.parse(localStorage.getItem("list"));
    // filter out the item being deleted
    const updatedList = watchList.filter(item => item.id !== movieId);
    // update localStorage
    localStorage.setItem("list", JSON.stringify(updatedList));
    this.setState({ watch: true });
  }

  render () {

    const detailList = (title, content) => {
    const contentText = Array.isArray(content) ? content.join(', ') : content;
      return (
        <div className="info">
          <div className="title">{title}</div>
          <div className="content">{contentText}</div>
        </div>
      );
    }; 
    return (
      <div className="Main-wrapper">   
        <div className="watch-list">  
          {
            JSON.parse(localStorage.getItem("list")) === null ? '' :
            JSON.parse(localStorage.getItem("list")).map((movie, i) => (
              <div key={movie.id} className="watch">
                <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt=""/>
                <div className="watch-title">
                  {movie.title}
                </div>
                {detailList('Genre', movie.genres.map((genre) => genre.name))}
                {detailList('Year', movie.release_date)}
                <div class="watch-button">
                  <button onClick={() => this.removeWatchList(movie.id)} className="remove-watch"> REMOVE 
                  </button>    
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default WatchList;
