import React from 'react';
import { Pagination } from 'antd';

export default class MovieFooter extends React.Component {
  constructor(props) {
    super(props);
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  onShowSizeChange(current, pageSize) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onEditPageSize(current, pageSize);
  }

  onPageChange(current) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onEditPage(current);
  }

  render() {
    const { page, pageSize, apiPage, moviesLength, selectedTab } = this.props;

    const total = apiPage * 20 > moviesLength ? moviesLength : 100;

    const navigation = (
      <Pagination
        showSizeChanger={pageSize <= moviesLength && page === 1}
        onShowSizeChange={this.onShowSizeChange}
        onChange={this.onPageChange}
        defaultCurrent={1}
        current={page}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={[6, 10, 20]}
        disabled={!moviesLength}
      />
    );
    return <div>{selectedTab === 'Search' ? navigation : null}</div>;
  }
}
