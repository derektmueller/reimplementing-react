
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

* rendering html elements, functional components, and class components
* passing props & children
* state change triggers DOM update
* component update preserves class component instances
* componentWillMount, componentWillUpdate, and componentWillUnmount lifecycle methods

#### TODO

* more lifecycle methods
* perform only necessary updates on DOM nodes
* batch DOM updates
* handle inserts and removals
* use key attribute when performing DOM reconciliation
* jsx transpiler

