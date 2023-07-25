import React from 'react';
import { Alert, Button } from 'antd';

export default class ThrowError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { click: false };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState(({ click }) => {
      return { click: !click };
    });
  }

  render() {
    const { click } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    const { name, message, stack } = this.props.error;

    const editStack = stack.split('\n').map((item, index) => {
      const id = index + 1;
      return <p key={id}>{item}</p>;
    });

    const description = click ? editStack : message;

    return (
      <Alert
        message={name}
        showIcon
        description={description}
        type="error"
        action={
          <Button size="small" danger onClick={this.onClick}>
            Detail
          </Button>
        }
      />
    );
  }
}
