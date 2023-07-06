import React from 'react';
import { format, parseISO } from 'date-fns';
import { Rate } from 'antd';

import './item.css';
import posterError from '../../media/404-poster-not-found.png';

function descriptionFormatted(description, limit) {
  let newStr = description;

  if (description.length > limit) {
    newStr = description.slice(0, description.lastIndexOf(' ', limit));
    newStr += '…';
  }

  return newStr;
}

function color(number) {
  let colorClass;

  if (number < 3) {
    colorClass = 'cE90000';
  } else if (number >= 3 && number < 5) {
    colorClass = 'cE97E00';
  } else if (number >= 5 && number < 7) {
    colorClass = 'cE9D100';
  } else {
    colorClass = 'cE66E900';
  }

  return colorClass;
}

export default class Item extends React.Component {
  onRated = (value, id) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setRated(id, value);
  };

  render() {
    const { movie } = this.props;
    const { id, title, date, genre, description, poster, vote } = movie;

    const elementGenre = genre.map((item, idx) => {
      const key = 10 * idx;
      return (
        <span key={key} className="movie-genre">
          {item}
        </span>
      );
    });

    const dateFormatted = date ? format(parseISO(date), 'MMMM dd, yyyy') : 'Date is not defined';

    const limit = 180;
    const posterPath = 'https://www.themoviedb.org/t/p/w220_and_h330_face';

    return (
      <div className="movie-container">
        <img
          className="movie-logo"
          loading="lazy"
          src={poster ? posterPath + poster : posterError}
          alt={`Poster for${title} film`}
        />
        <div className="movie-information">
          <div className="movie-info-header">
            <span className="movie-title">{title}</span>
            <span className={`movie-rated ${color(vote)}`}>{Math.floor(vote * 10) / 10}</span>
          </div>
          <div className="movie-info-body">
            <div className="movie-release-date">
              <span>{dateFormatted}</span>
            </div>
            <div className="movie-genres">{elementGenre}</div>
            <div className="movie-description">
              <span>{descriptionFormatted(description, limit)}</span>
            </div>
          </div>
        </div>
        <div className="movie-info-footer">
          <Rate
            allowHalf
            count={10}
            defaultValue={5}
            value={vote}
            style={{ fontSize: 16 }}
            onChange={(value) => this.onRated(value, id)}
          />
        </div>
      </div>
    );
  }
}
