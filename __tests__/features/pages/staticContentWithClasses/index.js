
const ListItem = ({children}) => 
  React.createElement('li', null, children);

class List extends React.Component {
  render() {
    return React.createElement(
      'div', null, [
        React.createElement(
          'h1', null, [
            'list header'
          ]),
        React.createElement(
          'ul', null, this.props.children)
      ]);
  }
}

ReactDOM.render(
  React.createElement(
    List, null, [
      React.createElement(ListItem, null, ['item a']),
      React.createElement(ListItem, null, ['item b']),
      React.createElement(ListItem, null, ['item c']),
      React.createElement(ListItem, null, ['item d']),
    ]),
    document.querySelector('#container'));

