

function renderElement(element) {
  const root = document.createElement(element.type);

  element.props.children.forEach(child => {
    if(Object.prototype.toString.call(child) === '[object String]') {
      root.innerHTML += child;
    } else {
      root.appendChild(renderElement(child));
    }
  });

  const attributeMap = new Map(
    [
      ['className', 'class']
    ]
  );

  Object.keys(element.props).forEach(key => {
    if(key === 'children') return;

    root.setAttribute(
      attributeMap.get(key) || key, element.props[key]);
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

