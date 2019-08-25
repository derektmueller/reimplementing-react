
import React from './react';

const ATTRIBUTE_MAP = new Map(
  [
    ['className', 'class']
  ]
);

function applyAttributes(node, props) {
  Object.keys(props).forEach(key => {
    if(key === 'children') return;

    node.setAttribute(
      ATTRIBUTE_MAP.get(key) || key, props[key]);
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

