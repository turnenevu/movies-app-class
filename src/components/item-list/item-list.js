import React from 'react';

import Item from '../item';

import './item-list.css';

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { movies, page, pageSize, selectedTab, rated, setRated } = this.props;
    let selectTab = movies;

    let current = [...selectTab.slice((page - 1) * pageSize, pageSize * page)];

    if (selectedTab === 'Rated') {
      selectTab = rated;
      current = [...selectTab];
    }
    const elements = current.map((item) => {
      return <Item key={item.id} movie={item} setRated={setRated} />;
    });

    return <div className="item-list">{elements}</div>;
  }
}
