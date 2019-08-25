
import React from './react';

const EVENT_HANDLER_MAP = new Map(
  [
    ['onClick', 'onclick'],
  ]
);

const ATTRIBUTE_MAP = new Map(
  [
    ['className', 'class'],
    ['id', 'id'],
  ]
);

function applyEventHandlers(node, props) {
  Object.keys(props).forEach(key => {
    if(!EVENT_HANDLER_MAP.get(key)) return;

    node[EVENT_HANDLER_MAP.get(key)] = props[key];
  });
}

function applyAttributes(node, props) {
  Object.keys(props).forEach(key => {
    if(!ATTRIBUTE_MAP.get(key)) return;

    node.setAttribute(ATTRIBUTE_MAP.get(key), props[key]);
  });
}

function renderChildren(node, children) {
  children.forEach(child => {
    if(Object.prototype.toString.call(child) 
      === '[object String]') {

      node.innerHTML += child;
    } else {
      node.appendChild(renderElement(child));
    }
  });
}

function renderElement(element) {
  if(element.type.prototype instanceof React.Component) {
    return renderElement((new element.type(element.props)).render());
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return renderElement(element.type(element.props));
  } else {
    const root = document.createElement(element.type);

    applyAttributes(root, element.props);
    applyEventHandlers(root, element.props);
    renderChildren(root, element.props.children);

    return root;
  }
}

const ReactDOM = {
  render: (element, container) => {
    container.appendChild(renderElement(element));

    return null;
  }
};

export default ReactDOM;

