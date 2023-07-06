import React from 'react';
import { Tabs, Input } from 'antd';

export default class MovieHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.onSearch = this.onSearch.bind(this);
    this.onEditTab = this.onEditTab.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onSearch(value) {
    const query = typeof value === 'object' ? value.target.value : value;

    // eslint-disable-next-line react/destructuring-assignment
    this.props.onEditQyery(query.trim());

    this.setState({
      value: query,
    });
  }

  onEditTab(key) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onEditTab(this.props.tabs[key - 1]);
  }

  render() {
    const { Search } = Input;
    const { tabs, selectedTab } = this.props;
    const { value } = this.state;

    const search = (
      <Search
        placeholder="Input for search film..."
        allowClear
        size="large"
        value={value}
        onChange={this.onSearch}
        onSearch={this.onSearch}
        autoFocus
      />
    );
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          centered
          items={tabs.map((item, i) => {
            const id = String(i + 1);
            return {
              label: item,
              key: id,
            };
          })}
          onChange={this.onEditTab}
        />
        {selectedTab === 'Search' ? search : null}
      </div>
    );
  }
}
