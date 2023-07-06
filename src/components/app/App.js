import React from 'react';
import { Layout, Space, Spin } from 'antd';

import MovieDbService from '../../serivices/movie-db-service';
import MovieHeader from '../header';
import ItemList from '../item-list';
import MovieFooter from '../footer';

import './App.css';

export default class App extends React.Component {
  moviesDb = new MovieDbService();

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      query: '',
      page: 1,
      pageSize: 6,
      tabs: ['Search', 'Rated'],
      selectedTab: 'Search',
      rated: [],
      loading: false,
    };
    this.onEditPage = this.onEditPage.bind(this);
    this.onEditPageSize = this.onEditPageSize.bind(this);
    this.onEditQuery = this.onEditQuery.bind(this);
    this.onEditTab = this.onEditTab.bind(this);
    this.setRated = this.setRated.bind(this);
  }

  onEditPage(newPage) {
    this.setState(({ movies, pageSize }) => {
      if (movies.length - newPage * pageSize < 0) return { loading: true };

      return { loading: false };
    });

    this.setState(({ movies, query, pageSize }) => {
      let checkMovies = movies.length - newPage * pageSize;
      if (checkMovies < 0) {
        const apiPage = movies.length / 20;

        // eslint-disable-next-line no-plusplus
        for (let i = 1; checkMovies < 0; i++) {
          this.addMovies(query, apiPage + i);
          checkMovies += 20;
        }
      }

      return {
        page: newPage,
      };
    });
  }

  onEditPageSize(current, pageSize) {
    this.setState({
      pageSize,
    });
  }

  onEditQuery(query) {
    const state = (newArr) => {
      this.setState(() => {
        return {
          movies: newArr,
          query,
          page: 1,
          loading: false,
        };
      });
    };

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.query !== query) {
      this.setState({ loading: true });
      this.requestMovies(query, 1, state);
    }
  }

  onEditTab(tab) {
    this.setState({
      selectedTab: tab,
    });
  }

  setRated(id, value) {
    this.setState(({ rated, movies }) => {
      let current = [...rated];

      const index = current.findIndex((item) => item.id === id);

      if (index >= 0) {
        current[index] = { ...current[index], vote: value };
      } else {
        const arr = movies.filter((item) => item.id === id);
        current = [...current, { ...arr[0], vote: value }];
      }

      return {
        rated: current,
      };
    });
  }

  addMovies(query, page) {
    const state = (newArr) => {
      this.setState(({ movies }) => {
        return {
          movies: movies.concat(newArr),
          loading: false,
        };
      });
    };

    this.requestMovies(query, page, state);
  }

  requestMovies(query, page, cbFunc) {
    this.moviesDb
      .getMovies(query, page)
      .then((moviesPage) => {
        const newArr = [];

        moviesPage.forEach((m) => {
          newArr.push({
            id: m.id,
            title: m.title,
            date: m.release_date,
            genre: ['Action', 'Drama'],
            description: m.overview,
            poster: m.poster_path,
            vote: m.vote_average,
          });
        });

        cbFunc(newArr);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Could not fetch ${err}`);
      });
  }

  render() {
    const { Header, Footer, Content } = Layout;

    const { movies, page, pageSize, tabs, selectedTab, rated, loading } = this.state;

    return (
      <Space
        direction="vertical"
        style={{
          width: '100%',
          alignItems: 'center',
        }}
        size={[0, 48]}
      >
        <Layout className="layoutStyle">
          <Header className="headerStyle">
            <MovieHeader
              tabs={tabs}
              selectedTab={selectedTab}
              onEditQyery={this.onEditQuery}
              onEditTab={this.onEditTab}
            />
          </Header>
          <Content className="contentStyle">
            <Spin tip="Loading" size="large" spinning={loading}>
              <ItemList
                movies={movies}
                page={page}
                pageSize={pageSize}
                selectedTab={selectedTab}
                rated={rated}
                setRated={this.setRated}
              />
            </Spin>
          </Content>
          <Footer className="footerStyle">
            <MovieFooter
              page={page}
              pageSize={pageSize}
              moviesLength={movies.length}
              selectedTab={selectedTab}
              onEditPage={this.onEditPage}
              onEditPageSize={this.onEditPageSize}
            />
          </Footer>
        </Layout>
      </Space>
    );
  }
}
