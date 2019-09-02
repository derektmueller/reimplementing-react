
import {renderElement} from './rendering';

class Component {
  constructor(props) {
    this.props = props;
    this.parentDomNode = null;
    this.domNode = 0;
  }

  setState(args) {
    this.state = {...this.state, ...args};
    const html = renderElement(this.render(), this.parentDomNode);
    this.parentDomNode.replaceChild(html, this.domNode);
    this.domNode = html;
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
