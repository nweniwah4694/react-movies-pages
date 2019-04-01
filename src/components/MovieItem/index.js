import React, { Component } from 'react';
import { API_KEY, PATH_BASE, PATH_MOVIE } from '../../api';
import CastList from '../../components/CastList';
import { imgSrc } from '../../utils';
import Popup from "reactjs-popup";
import CircularProgressbar from 'react-circular-progressbar';
import ModalVideo from 'react-modal-video'
import './index.css';

class MovieItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      watch: true,
      open: false,
      isOpen: false,    
      movie: {
        genres: [],
        videos: {
          results: []
        },
        credits: {
          cast: [],
          crew: []
        },
        images: {
          backdrops: []
        },
        belongs_to_collection: []
      },     
    };
    this.openVedioModal = this.openVedioModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );     
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
      // for all items in state
      for (let key in this.state) {
        // if the key exists in localStorage
        if (localStorage.hasOwnProperty(key)) {
          // get the key's value from localStorage
          let value = localStorage.getItem(key);

          // parse the localStorage string and setState
          try {
            value = JSON.parse(value);
            this.setState({ [key]: value });
          } catch (e) {
            // handle empty string
            this.setState({ [key]: value });
          }
        }
      }
  }

  saveStateToLocalStorage() {
      // for every item in React state
      for (let key in this.state) {
        // save to localStorage
        localStorage.setItem(key, JSON.stringify(this.state[key]));
      }
  }

  //modal for vedio play
  openVedioModal () {  
    this.setState({isOpen: true})
  }

  //open pop up movie detail box
  openModal (movieId) {
    this.checkMovie(this.props.id);
    fetch(`${PATH_BASE}${PATH_MOVIE}/${movieId}?api_key=${API_KEY}&append_to_response=credits,images,videos`)
    .then(response => response.json())
    .then(movie => (      
      this.setState({ movie: movie })
    ));
    this.setState({ open: true });
  }

  //close pop up movie detail box
  closeModal () {
    this.setState({ open: false })
  }  

  addWatchList(movie) {
    // create a new item
    const newItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      genres: movie.genres,
      release_date: movie.release_date
    };

    const data = JSON.parse(localStorage.getItem("list"));
    // check first time item or local storage data already exits
    if(data != null) {
    
      const watchList = data;
      watchList.push(newItem);   
      localStorage.setItem("list", JSON.stringify(watchList));  
    } else {

      const watchList = [];
      watchList.push(newItem); 
      localStorage.setItem("list", JSON.stringify(watchList));    
    }      
    this.setState({ watch: false });
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

  checkMovie(movieId) {
    //check already movie exit
    const data = JSON.parse(localStorage.getItem("list"));
    if(data != null) {
      const data = JSON.parse(localStorage.getItem("list")).filter(moveItem => moveItem.id === movieId )
      if(data.length > 0) {
        this.setState({ watch: false });
      } else {
        this.setState({ watch: true });
      }
    } 
  }

  render () { 
    //backdrops images
    const trialor = this.state.movie.videos.results.slice(0, 1); 
    //backdrops images
    const overviewImages = this.state.movie.images.backdrops.slice(0, 4); 
    //crew list
    const crewList = this.state.movie.credits.crew.slice(0, 5);
    const detailList = (title, content) => {
    const contentText = Array.isArray(content) ? content.join(', ') : content;
      return (
        <div className="flex">
          <div className="bold-white-text list-title">{title}</div>
          <div className="list-content">{contentText}</div>
        </div>
      );
    }; 
   
    return (
      <div key={this.props.id} className="list-container__movie-item">
        <div className="list__movie-image">        
          <div>
            <div className="list__movie-image-link" onClick = {() => this.openModal(this.props.id)} ><img src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${this.props.posterPath}`} alt={this.props.title}/></div>
            <div className="list__movie-title">
              {this.props.title}
            </div>
            <div className="genre-year">
              <div className="genre"><span>Genre:</span></div>
              <div className="year"><span>Year:</span>{this.props.year}</div>
            </div>
            <div className="list__movie-actions">
              <span className="list__movie-vote-average">{this.props.voteAverage}</span>  
            </div>              
          </div>     
        </div>  
        <Popup 
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
            <div className="modal" id={this.state.movie.id} key={this.state.movie.id}>              
              <div className="Movie-wrapper">  
                <span className="close" onClick={this.closeModal}>
                 <i class="fa fas fa-chevron-left"></i>Back to the list
                </span>    
                <div className="movie-content">
                  <div className="poster">
                    <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500${this.state.movie.poster_path}`} alt=""/>
                    <div className="book-watch"><i class="fa fal fa-bookmark"></i>Bookmark</div>
                     {this.state.watch === true ? 
                        <div className="book-watch" onClick={() => this.addWatchList(this.state.movie)}><i class="fa fa-star-o"></i>Add watchlist
                        </div> 
                      :
                        <div className="book-watch" onClick={() => this.removeWatchList(this.state.movie.id)}><i class="fa fa-star-o"></i>Remove watchlist
                        </div>                                      
                    }                     
                    {
                      this.state.movie.belongs_to_collection === null ? '' :
                      <div className="related-movies"> 
                        <div className="related-title">Related Movies</div>
                        <div className="related-movie" key={this.state.movie.belongs_to_collection.id}>
                          <img className="collection-poster" src={`https://image.tmdb.org/t/p/w500${this.state.movie.belongs_to_collection.poster_path}`} alt=""/>
                          <div>{this.state.movie.belongs_to_collection.name}</div>
                        </div>  
                      </div>                    
                    }                    
                  </div>
            <div className="movie-data">
              <h1 className="movie-title">{this.state.movie.title}</h1>
              <div className="flex movie-details">
                <div className="movie-rating">
                  <CircularProgressbar
                    percentage={this.state.movie.vote_average * 10}
                    text={this.state.movie.vote_average}
                    strokeWidth={10}
                  />
                  <div>User Score</div>                  
                </div>
                <div className="vedio-player">
                  {
                    trialor.map((video, i) => (
                      <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId={video.key} onClose={() => this.setState({isOpen: false})} />
                    ))
                  }
                  <div onClick={this.openVedioModal}><i class="fa fas fa-play"></i><span>Play Vedio</span></div>
                  </div>
                <div className="flex detail-list">   
                  {detailList('Genre', this.state.movie.genres.map((genre) => genre.name))}
                  {detailList('Release Year', this.state.movie.release_date)}
                  {detailList('Duration', `${this.state.movie.runtime} min`)}
                </div>
              </div> 
              <div className="line"></div>
              <div className="overview">
                <h3 className="movie-overview-title">Overview</h3>
                <p className="movie-overview">{this.state.movie.overview}</p>
                <h3 className="crew-title">Feature Crew</h3>   
                <div className="crew-list">  
                  {
                    crewList.map((crew, i) => (
                      <div key={crew.id} className="crew">
                        <span className="left">{crew.job}</span>
                        <span className="right">{crew.name}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="cast line"></div>
              <div className="cast-list">
                <h3 className="cast-title">Top Billed Cast</h3>
                <CastList cast={this.state.movie.credits.cast.slice(0, 5)} />   
              </div>     
              <div className="background line"></div>
              <div className="background-list">
                <h3 className="background-title">Background</h3>   
                <div className="gallery">  
                  {
                    overviewImages.map((image, i) => (
                      <div key={image.file_path}>
                        <img
                          alt="movie images"
                          src={imgSrc(image.file_path, 780)}
                          key={image.file_path}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          </div>       
          </div>
        </Popup>      
      </div>
    );
  }
}

export default MovieItem;
