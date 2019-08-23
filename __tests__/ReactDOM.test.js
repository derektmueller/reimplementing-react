
import ReactDOM from '../src/react-dom';
import React from '../src/react';
import lazy from 'jasmine-lazy';

describe('ReactDOM', () => {
  describe('render', () => {
    describe('rendering an html element by itself', () => {
      lazy('element', () => React.createElement('div', null));

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

    describe('rendering an html element with props', () => {
      lazy('id', () => 'some-id');
      lazy('className', () => 'some-class-name');
      lazy('element', () => 
        React.createElement('div', {id, className}));

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
      });

      it('renders the element into the container', () => {
        expect(
          ReactDOM.render(
            element, document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML).toEqual(
          `<div id="container">` 
          + `<div id="${id}" class="${className}"></div></div>`
        );
      });
    });

    describe('rendering an html element with text', () => {
      lazy('element', () => 
        React.createElement('div', null, ['test']));

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

    describe(
      'rendering an html element with multiple text children', () => {

      lazy('element', () => 
        React.createElement('div', null, ['test1', 'test2']));

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
      lazy('element', () => 
        React.createElement(
          'div', null, [
            React.createElement('div', null, ['test'])
          ]));

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

