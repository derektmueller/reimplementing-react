
import ReactDOM from '../src/react-dom';
import lazy from 'jasmine-lazy';

describe('ReactDOM', () => {
  describe('render', () => {
    lazy('element', () => null);
    lazy('container', () => null);

    it('accepts and element and container and returns null', () => {
      expect(ReactDOM.render(element, container)).toEqual(null);
    });
  });
});

