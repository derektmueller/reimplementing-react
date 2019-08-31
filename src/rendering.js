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
  children.forEach((child, i) => {
    if(Object.prototype.toString.call(child) 
      === '[object String]') {

      node.innerHTML += child;
    } else {
      node.appendChild(renderElement(child, node, i));
    }
  });
}

export function renderElement(element, parentDomNode, childIndex=0) {
  if(element.type.prototype instanceof React.Component) {
    const componentInstance = new element.type(element.props);

    componentInstance.parentDomNode = parentDomNode;

    const node = renderElement(
      componentInstance.render(), parentDomNode);

    componentInstance.domNode = node;

    return node;
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return renderElement(element.type(element.props), parentDomNode);
  } else {
    const root = document.createElement(element.type);

    applyAttributes(root, element.props);
    applyEventHandlers(root, element.props);
    renderChildren(root, element.props.children);

    return root;
  }
}

