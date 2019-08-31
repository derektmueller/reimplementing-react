
import {renderElement} from './rendering';

const ReactDOM = {
  render: (element, container) => {
    container.appendChild(
      renderElement(element, container), container);

    return null;
  }
};

export default ReactDOM;

