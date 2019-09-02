
## Reimplementation of React.js (Work-in-progress)

This project is a reimplementation of a subset of the React.js API built as a learning exercise.

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

