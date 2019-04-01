import React from 'react';
import MovieItem from '../../components/MovieItem';
import './index.css';

const List = (props) => {
    const movieItems = props.list.map(movie => {
    return <MovieItem
            key={movie.id}
            id={movie.id}
            voteAverage={movie.vote_average}
            posterPath={movie.poster_path}
            title={movie.title}
            year={movie.release_date}
            genres={movie.genre_ids} />
    });
    return (
      <div className="list-container">{movieItems}</div>
    );
}

export default List;
