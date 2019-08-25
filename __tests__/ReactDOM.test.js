
import ReactDOM from '../src/react-dom';
import React from '../src/react';
import lazy from 'jasmine-lazy';

const renderingClassComponents = () => {
  describe(
    'rendering a class component that returns html', () => {

    lazy('element', () => {
      return React.createElement(class extends React.Component {
        render() {
          return React.createElement('div');
        }
      });
    });

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe('state', () => {
    lazy('args', () => ({text: updatedText}));
    lazy('buttonId', () => 'some-button-id');
    lazy('originalText', () => 'original-text');
    lazy('updatedText', () => 'updated-text');
    lazy('element', () => {
      return React.createElement(class extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
            text: originalText
          };
        }

        render() {
          return React.createElement('button', {
            onClick: () => {
              this.setState(args);
            },
            id: buttonId,
          }, [originalText]);
        }
      });
    });

    beforeEach(() => {
      jest.spyOn(React.Component.prototype, 'setState');
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('setState can be called within class', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      document.querySelector(`#${buttonId}`).click();

      expect(React.Component.prototype.setState)
        .toHaveBeenCalledWith(args);
    });

    xit('setState triggers a re-render', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toMatch(originalText);

      document.querySelector(`#${buttonId}`).click();

      expect(document.body.innerHTML).toMatch(updatedText);
    });
  });

  describe(
    'passing props to class components', () => {

    lazy('id', () => 'some-id');
    lazy('element', () => {
      return React.createElement(class extends React.Component {
        render() {
          return React.createElement('div', {id: this.props.id});
        }
      }, {id});
    });

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        `<div id="container"><div id="${id}"></div></div>`
      );
    });
  });
};

const renderingFunctionalComponents = () => {
  describe(
    'rendering a functional component that returns html', () => {

    lazy('element', () => 
      React.createElement(() => React.createElement('div')));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe(
    'nested functional components', () => {

    lazy('element', () => 
      React.createElement(() => 
        React.createElement(() => 
          React.createElement('div'))));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div></div></div>'
      );
    });
  });

  describe(
    'passing children to functional components', () => {

    lazy('element', () => 
      React.createElement(
        ({children}) => 
          React.createElement('div', null, children)
        , null, ['test'])
    );

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element returned by the component', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toEqual(
        '<div id="container"><div>test</div></div>'
      );
    });
  });
};

const renderingHtmlElements = () => {
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

  describe('rendering an html element with a click handler', () => {
    lazy('onClick', () => jest.fn());
    lazy('id', () => 'some-id');
    lazy('element', () => 
      React.createElement('div', {id, onClick}));

    beforeEach(() => {
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('renders the element into the container', () => {
      expect(
        ReactDOM.render(
          element, document.querySelector("#container")))
        .toEqual(null);

      document.querySelector(`#${id}`).click();
      expect(onClick).toHaveBeenCalled();
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
};

describe('ReactDOM', () => {
  describe('render', () => {
    renderingHtmlElements();
    renderingFunctionalComponents();
    renderingClassComponents();
  });
});

