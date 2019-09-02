
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }

  render() {
    return React.createElement(
      'div', null, [
        `Count: ${this.state.count}`,
        React.createElement('button', {
          onClick: () => { 
            this.setState({count: this.state.count + 1}); 
          }
        }, ['+']),
        React.createElement('button', {
          onClick: () => { 
            this.setState({count: this.state.count - 1}); 
          }
        }, ['-'])
      ]);
  }
}

ReactDOM.render(
  React.createElement(Counter), 
  document.querySelector('#container'));

