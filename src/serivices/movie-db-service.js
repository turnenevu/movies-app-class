import React from 'react';

export default class MovieDbService extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  async getResource(query, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTkzZGYzMWYxOTEyMzFlYWJhY2RiM2Y3NTdkNzc0NiIsInN1YiI6IjY0OTczZmMzNmY2YTk5MDEzZGRmN2U5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Hy_bhNIgeh-AmeOLi6rKtdfrH6BKcSG5rHPweYrLYX0',
      },
    };

    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`, options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${query} \n, received ${res.status}`);
    }
    return res.json();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  async getMovies(query = '', page = 1) {
    const res = await this.getResource(query, page);

    return res.results;
  }
}
