
class Component {
  constructor(props) {
    this.props = props;
  }

  setState(args) {
    this.state = {...this.state, ...args};
  }
}

function createElement(
    type, props, children=[]) {

  return {
    type,
    props: {
      children,
      ...props
    }
  }
}

export default {
  Component,
  createElement
}
