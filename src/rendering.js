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

class DOMComponent {
  constructor(element) {
    this.element = element;
  }

  mount() {
    const root = document.createElement(this.element.type);

    applyAttributes(root, this.element.props);
    applyEventHandlers(root, this.element.props);
    renderChildren(root, this.element.props.children);

    return root;
  }
}

class ClassComponent {
  constructor(element, parentDomNode) {
    this.element = element;
    this.parentDomNode = parentDomNode;
    this.publicInstance;
    this.domNode;
  }

  mount() {
    const element = this.element;
    const componentInstance = new element.type(element.props);

    this.publicInstance = componentInstance;
    componentInstance.privateInstance = this;

    const node = renderElement(
      componentInstance.render(), this.parentDomNode);

    this.domNode = node;

    return node;
  }

  update() {
    const html = renderElement(
      this.publicInstance.render(), 
      this.parentDomNode);
    this.parentDomNode.replaceChild(
      html, this.domNode);
    this.domNode = html;
  }
}

export function renderElement(element, parentDomNode) {
  if(element.type.prototype instanceof React.Component) {
    return (new ClassComponent(element, parentDomNode))
      .mount();
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return renderElement(element.type(element.props), parentDomNode);
  } else {
    return (new DOMComponent(element)).mount();
  }
}

