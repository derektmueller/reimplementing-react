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
      renderElement(child, node);
    }
  });
}

export function renderElement(element, container) {
  if(element.type.prototype instanceof React.Component) {
    renderElement(
      (new element.type(element.props)).render(), container);
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    renderElement(element.type(element.props), container);
  } else {
    const root = document.createElement(element.type);

    applyAttributes(root, element.props);
    applyEventHandlers(root, element.props);
    renderChildren(root, element.props.children);

    container.appendChild(root);
  }

  return null;
}

