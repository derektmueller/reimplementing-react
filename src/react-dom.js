

function renderElement(element) {
  const root = document.createElement(element.type);

  element.props.children.forEach(child => {
    if(Object.prototype.toString.call(child) === '[object String]') {
      root.innerHTML += child;
    } else {
      root.appendChild(renderElement(child));
    }
  });

  return root;
}

const ReactDOM = {
  render: (element, container) => {
    container.appendChild(renderElement(element));

    return null;
  }
};

export default ReactDOM;

