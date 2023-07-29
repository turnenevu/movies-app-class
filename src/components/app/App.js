import React from 'react';
import { Layout, Space, Spin, Alert } from 'antd';

import MovieDbService from '../../serivices/movie-db-service';
import MovieHeader from '../header';
import ItemList from '../item-list';
import MovieFooter from '../footer';
import ThrowError from '../error';
import NetworkStatus from '../network-status';

import './App.css';

export default class App extends React.Component {
  moviesDb = new MovieDbService();

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      query: '',
      apiPage: 1,
      page: 1,
      pageSize: 6,
      tabs: ['Search', 'Rated'],
      selectedTab: 'Search',
      rated: [],
      loading: false,
      error: {
        status: false,
        name: '',
        message: '',
        stack: '',
      },
    };
    this.onEditPage = this.onEditPage.bind(this);
    this.onEditPageSize = this.onEditPageSize.bind(this);
    this.onEditQuery = this.onEditQuery.bind(this);
    this.onEditTab = this.onEditTab.bind(this);
    this.setRated = this.setRated.bind(this);
  }

  onEditPage(newPage) {
    const { movies, pageSize, query, apiPage } = this.state;

    const checkMovies = movies.length - newPage * pageSize;

    if (checkMovies < 0 && movies.length >= apiPage * 20) {
      this.setState({ loading: true });
      const iterate = Math.abs(Math.floor(checkMovies / 20));

      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= iterate; i++) {
        this.moviesDb
          .getMovies(query, apiPage + i)
          .then((newMovies) => {
            // eslint-disable-next-line no-shadow
            this.setState(({ movies }) => {
              let currentPage = newPage;
              const pages = Math.ceil(movies.length / pageSize);

              if (currentPage > pages && newMovies.length === 0) currentPage = pages;

              return {
                movies: [...movies, ...newMovies],
                apiPage: apiPage + i,
                page: currentPage,
                loading: false,
                error: {
                  status: false,
                },
              };
            });
          })
          .catch((err) => {
            this.setState({
              error: {
                status: true,
                name: err.name,
                message: err.message,
                stack: err.stack,
              },
              loading: false,
            });
          });
      }
    } else {
      this.setState({ page: newPage });
    }
  }

  onEditPageSize(current, pageSize) {
    this.setState({
      pageSize,
    });
  }

  onEditQuery(search) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.query !== search) {
      this.setState({ loading: true });

      this.moviesDb
        .getMovies(search, 1)
        .then((movies) => {
          this.setState({
            movies,
            query: search,
            page: 1,
            apiPage: 1,
            loading: false,
            error: {
              status: false,
            },
          });
        })
        .catch((err) => {
          this.setState({
            error: {
              status: true,
              name: err.name,
              message: err.message,
              stack: err.stack,
            },
            loading: false,
          });
        });
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

  render() {
    const { Header, Footer, Content } = Layout;
    const { ErrorBoundary } = Alert;

    const { movies, query, page, pageSize, apiPage, tabs, selectedTab, rated, loading, error } = this.state;

    const hasData = error.status ? (
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    ) : (
      // <Alert message="Error" description={error.description} type="error" showIcon />
      <ItemList
        movies={movies}
        page={page}
        pageSize={pageSize}
        selectedTab={selectedTab}
        rated={rated}
        setRated={this.setRated}
      />
    );

    return (
      <Space
        direction="vertical"
        style={{
          width: '100%',
          alignItems: 'center',
        }}
        size={[0, 48]}
      >
        <NetworkStatus>
          {({ online }) => (
            <Layout className="layoutStyle">
              <Header className="headerStyle">
                <MovieHeader
                  tabs={tabs}
                  selectedTab={selectedTab}
                  onEditQyery={this.onEditQuery}
                  onEditTab={this.onEditTab}
                  network={online}
                />
                {online ? null : (
                  <Alert
                    message="Warning"
                    description="You're offline right now. Check your connection."
                    type="warning"
                    showIcon
                    closable
                  />
                )}
              </Header>
              <Content className="contentStyle">
                <Spin tip="Loading" size="large" spinning={loading}>
                  {movies.length === 0 && query && selectedTab === 'Search' ? (
                    <Alert
                      message="No movies match your search"
                      description={`Nothing found for "${query}"`}
                      type="info"
                      showIcon
                    />
                  ) : (
                    hasData
                  )}
                </Spin>
              </Content>
              <Footer className="footerStyle">
                <MovieFooter
                  page={page}
                  pageSize={pageSize}
                  apiPage={apiPage}
                  moviesLength={movies.length}
                  selectedTab={selectedTab}
                  onEditPage={this.onEditPage}
                  onEditPageSize={this.onEditPageSize}
                  network={online}
                />
              </Footer>
            </Layout>
          )}
        </NetworkStatus>
      </Space>
    );
  }
}
