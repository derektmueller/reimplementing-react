
import ReactDOM from '../src/react-dom';
import lazy from 'jasmine-lazy';

describe('ReactDOM', () => {
  describe('render', () => {
    describe('rendering a div by itself', () => {
      lazy('element', () => ({
        type: 'div',
        props: {
          children: []
        }
      }));

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
      });

      it('renders the element into the container', () => {
        expect(
          ReactDOM.render(
            element, document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div></div></div>'
        );
      });
    });

    describe('rendering a div with text', () => {
      lazy('element', () => ({
        type: 'div',
        props: {
          children: ['test']
        }
      }));

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
      });

      it('renders the element into the container', () => {
        expect(
          ReactDOM.render(
            element, document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>test</div></div>'
        );
      });
    });

    describe('rendering a div with multiple text children', () => {
      lazy('element', () => ({
        type: 'div',
        props: {
          children: ['test1', 'test2']
        }
      }));

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
      });

      it('renders the element into the container', () => {
        expect(
          ReactDOM.render(
            element, document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>test1test2</div></div>'
        );
      });
    });

    describe('rendering nested html elements', () => {
      lazy('element', () => ({
        type: 'div',
        props: {
          children: [
            {
              type: 'div',
              props: {children: ['test']}
            }
          ]
        }
      }));

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
      });

      it('renders the element into the container', () => {
        expect(
          ReactDOM.render(
            element, document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div><div>test</div></div></div>'
        );
      });
    });
  });
});

