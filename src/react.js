
class Component {
  constructor(props) {
    this.props = props;
    this.privateInstance;
  }

  componentWillUnmount() {
  }

  componentWillMount() {
  }

  componentWillUpdate() {
  }

  setState(args) {
    this.state = {...this.state, ...args};
    this.privateInstance.update();
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
