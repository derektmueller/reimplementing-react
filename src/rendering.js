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

class HTMLStringComponent {
  constructor(string) {
    this.string = string;
  }

  update() {
    return this.mount();
  }

  mount() {
    return this.string;
  }
}

class DOMComponent {
  constructor(element, parentDomNode) {
    this.element = element;
    this.renderedElements;
    this.renderedComponents;
    this.parentDomNode = parentDomNode;
    this.domNode;
  }

  update() {
    const oldDomNode = this.domNode;
    const node = this.mount();

    this.parentDomNode.replaceChild(node, oldDomNode);

    return node;
  }

  mount() {
    const root = document.createElement(this.element.type);

    this.renderedElements = this.element.props.children;
    this.renderedComponents = 
      this.renderedElements.map((child) => {
        return instantiateComponent({
          element: child,
          parentDomNode: root
        });
      });

    applyAttributes(root, this.element.props);
    applyEventHandlers(root, this.element.props);

    this.renderedComponents.forEach((component) => {
      const nodeOrString = component.mount();
      if(Object.prototype.toString.call(nodeOrString) 
        === '[object String]') {

        root.innerHTML += nodeOrString;
      } else {
        root.appendChild(nodeOrString);
      }
    });

    this.domNode = root;

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

    if(this.renderedElement.type === nextRender.type) {
      this.renderedComponent.element.props = 
          nextRender.props;
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
  if(Object.prototype.toString.call(element) 
        === '[object String]') {
    return (new HTMLStringComponent(element));
  } else if(
    element.type.prototype instanceof React.Component) {

    return (new ClassComponent(element, parentDomNode));
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return (new FunctionalComponent(element, parentDomNode));
  } else {
    return (new DOMComponent(element, parentDomNode));
  }
}

export function renderElement(element, parentDomNode) {
  return instantiateComponent({
    element, parentDomNode
  }).mount();
}

