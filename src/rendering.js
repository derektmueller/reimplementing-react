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


class DOMComponent {
  constructor(element) {
    this.element = element;
    this.renderedElements;
    this.renderedComponents;
  }

  renderChildren(node, children) {
    children.forEach((child) => {
      if(Object.prototype.toString.call(child) 
        === '[object String]') {

        node.innerHTML += child;
      } else {
        node.appendChild(renderElement(child, node));
      }
    });
  }

  update() {
    return this.mount();
  }

  mount() {
    const root = document.createElement(this.element.type);

    applyAttributes(root, this.element.props);
    applyEventHandlers(root, this.element.props);
    this.renderChildren(root, this.element.props.children);

    return root;
  }
}

class ClassComponent {
  constructor(element, parentDomNode) {
    this.element = element;
    this.parentDomNode = parentDomNode;
    this.publicInstance;
    this.domNode;
    this.renderedElement;
    this.renderedComponent;
  }

  mount() {
    const element = this.element;
    const componentInstance = new element.type(element.props);

    this.publicInstance = componentInstance;
    componentInstance.privateInstance = this;

    const renderedElement = componentInstance.render();

    this.renderedElement = renderedElement;
    this.renderedComponent = instantiateComponent({
      element: this.renderedElement, 
      parentDomNode: this.parentDomNode
    });

    const node = this.renderedComponent.mount();

    this.domNode = node;

    return node;
  }

  update() {
    const nextRender = this.publicInstance.render();

    if(false &&
      this.renderedElement.type.prototype instanceof React.Component
      && this.renderedElement.type === nextRender.type) {
      this.renderedComponent.update();
    } else {
      const html = renderElement(
        nextRender, 
        this.parentDomNode);
      this.parentDomNode.replaceChild(
        html, this.domNode);
      this.domNode = html;
    }
  }
}

class FunctionalComponent {
  constructor(element, parentDomNode) {
    this.element = element;
    this.parentDomNode = parentDomNode;
    this.renderedElement;
    this.renderedComponent;
  }

  update() {
    return this.mount();
  }

  mount() {
    this.renderedElement = this.element.type(this.element.props);
    this.renderedComponent = instantiateComponent({
      element: this.renderedElement,
      parentDomNode: this.parentDomNode
    });

    return this.renderedComponent.mount();
  }
}

function instantiateComponent({element, parentDomNode}) {
  if(element.type.prototype instanceof React.Component) {
    return (new ClassComponent(element, parentDomNode));
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return (new FunctionalComponent(element, parentDomNode));
  } else {
    return (new DOMComponent(element));
  }
}

export function renderElement(element, parentDomNode) {
  return instantiateComponent({element, parentDomNode}).mount();
}

