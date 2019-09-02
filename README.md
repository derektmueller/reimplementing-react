
## Reimplementation of React.js (Work-in-progress)

This project is a reimplementation of a subset of the React.js API built as a learning exercise.

### Example Usage

The code below generates a simple counter that can be incremented and decremented.

[See example in CodePen](https://codepen.io/parenparen/pen/xxKXKPv?&editable=true&editors=0010)

```
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
```

### Build

```
yarn install
yarn build
```

### Test

```
# unit and integration tests
yarn test

# end-to-end tests
yarn test:features
```

### Progress

#### Completed

* rendering html elements
* rendering functional components
* rendering class components
* passing children to functional components
* passing props to html elements and functional components
* state change triggers DOM update

#### TODO

* handle component type differences when performing updates
* component unmount
* lifecycle methods
* use key attribute when performing DOM reconciliation
* jsx transpiler

