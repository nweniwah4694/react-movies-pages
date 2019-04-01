import React from 'react';
import { imgSrc } from '../../utils';

const actorRow = (actor) => (
  <div key={actor.id} className="cast-row">
    <img src={imgSrc(actor.profile_path, 92, 'avatar')} alt={actor.name} className="actor-img" />
    <div>{actor.name}</div>
  </div>
);

const CastList = ({ cast }) => (
  <section className="cast-list">
    {cast.map((actor) => {
      return actorRow(actor);
    })}
  </section>
);

export default CastList;
