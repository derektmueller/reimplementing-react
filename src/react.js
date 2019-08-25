
class Component {
  constructor(props) {
    this.props = props;
  }
}

function createElement(
    type, props, children=[]) {

  return {
    type,
    props: {
      children: children.map(child => {
        if(Object.prototype.toString.call(child) 
          === '[object String]') {

          return child;
        } else {
          return child;
        }
      }),
      ...props
    }
  }
}

export default {
  Component,
  createElement
}
