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

  mount() {
    return this.string;
  }
}

class DOMComponent {
  constructor(element) {
    this.element = element;
    this.renderedElements;
    this.renderedComponents;
    this.domNode;
  }

  getHostNode() {
    return this.domNode;
  }

  unmount() {
  }

  update(element) {
    this.element = element;

    const oldDomNode = this.domNode;
    const root = document.createElement(this.element.type);

    applyAttributes(root, this.element.props);
    applyEventHandlers(root, this.element.props);

    let i = 0, 
        j = 0;
    while(j < this.element.props.children.length &&
          i < this.renderedElements.length) {
      if(Object.prototype.toString.call(
          this.element.props.children[j]) === '[object String]') {

        this.appendHtml(
          root, this.element.props.children[j]);
      } else if(this.renderedElements[i].type 
         === this.element.props.children[j].type) {

        this.appendHtml(
          root, 
          this.renderedComponents[i]
            .update(this.element.props.children[j]));
      } else {
        const instance = instantiateComponent({
          element: this.element.props.children[j]
        });
        this.appendHtml(root, instance.mount());
      }

      i++;
      j++;
    }

    oldDomNode.parentNode.replaceChild(root, oldDomNode);
    this.domNode = root;

    return root;
  }

  mount() {
    const root = document.createElement(this.element.type);

    this.renderedElements = this.element.props.children;
    this.renderedComponents = 
      this.renderedElements.map((child) => {
        return instantiateComponent({
          element: child
        });
      });

    applyAttributes(root, this.element.props);
    applyEventHandlers(root, this.element.props);

    this.renderedComponents.forEach((component) => {
      const nodeOrString = component.mount();
      this.appendHtml(root, nodeOrString);
    });

    this.domNode = root;

    this.getHostNode().__reactInternalInstance = this;

    return root;
  }

  appendHtml(root, nodeOrString) {
    if(Object.prototype.toString.call(nodeOrString) 
      === '[object String]') {

      root.innerHTML += nodeOrString;
    } else {
      root.appendChild(nodeOrString);
    }
  }
}

class ClassComponent {
  constructor(element) {
    this.element = element;
    this.publicInstance;
    this.renderedElement;
    this.renderedComponent;
  }

  getHostNode() {
    return this.renderedComponent.getHostNode();
  }

  unmount() {
    this.publicInstance.componentWillUnmount();
    this.renderedComponent.unmount();
  }

  mount() {
    const element = this.element;
    const componentInstance = new element.type(element.props);

    this.publicInstance = componentInstance;
    componentInstance.privateInstance = this;

    const renderedElement = componentInstance.render();

    this.renderedElement = renderedElement;
    this.renderedComponent = instantiateComponent({
      element: this.renderedElement
    });

    this.publicInstance.componentWillMount();

    const node = this.renderedComponent.mount();

    this.getHostNode().__reactInternalInstance = this;

    return node;
  }

  update(nextElement=null) {
    if(nextElement) {
      this.publicInstance.props = nextElement.props;
    }

    const nextRender = this.publicInstance.render();

    if(this.renderedElement.type === nextRender.type) {
      this.publicInstance.componentWillUpdate();

      const domNode = this.renderedComponent.update(nextRender);

      return domNode;
    } else {
      const prevNode = this.getHostNode();

      this.renderedElement = nextRender;
      this.renderedComponent = instantiateComponent({
        element: this.renderedElement
      });

      const nextNode = this.renderedComponent.mount();

      prevNode.parentNode.replaceChild(nextNode, prevNode);

      return nextNode;
    }
  }
}

class FunctionalComponent {
  constructor(element) {
    this.element = element;
    this.renderedElement;
    this.renderedComponent;
  }

  getHostNode() {
    return this.renderedComponent.getHostNode();
  }

  unmount() {
  }

  update(element) {
    this.element = element;
    const nextRender = this.element.type(this.element.props);

    if(this.renderedElement.type === nextRender.type) {
      const domNode = this.renderedComponent.update(nextRender);

      return domNode;
    } else {
      const prevNode = this.getHostNode();

      this.renderedElement = nextRender;
      this.renderedComponent = instantiateComponent({
        element: this.renderedElement
      });

      const nextNode = this.renderedComponent.mount();

      prevNode.parentNode.replaceChild(nextNode, prevNode);

      return nextNode;
    }
  }

  mount() {
    this.renderedElement = this.element.type(this.element.props);
    this.renderedComponent = instantiateComponent({
      element: this.renderedElement
    });

    const node = this.renderedComponent.mount();

    this.getHostNode().__reactInternalInstance = this;
  
    return node;
  }
}

function instantiateComponent({element}) {
  if(Object.prototype.toString.call(element) 
        === '[object String]') {
    return (new HTMLStringComponent(element));
  } else if(
    element.type.prototype instanceof React.Component) {

    return (new ClassComponent(element));
  } else if(Object.prototype.toString.call(element.type) 
    === '[object Function]') {

    return (new FunctionalComponent(element));
  } else {
    return (new DOMComponent(element));
  }
}

function unmountTree(container) {
  container.firstChild.__reactInternalInstance.unmount();
  container.innerHTML = '';
}

export function renderElement(element, container) {
  let domNode;
  if(container.firstChild) {
    if(container.firstChild.__reactInternalInstance.element.type
       === element.type) {

      const component = container.firstChild.__reactInternalInstance;

      domNode = component.update(element);
    } else {
      unmountTree(container);
      domNode = instantiateComponent({
        element
      }).mount();
    }
  } else {
    domNode = instantiateComponent({
      element
    }).mount();
  }

  container.appendChild(domNode);
}

