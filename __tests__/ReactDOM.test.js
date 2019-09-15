
import ReactDOM from '../src/react-dom';
import React from '../src/react';
import lazy from 'jasmine-lazy';

const renderingClassComponents = () => {
  describe('updating', () => {
    describe('when the child type does match', () => {
      lazy('oldComponent', () => {
        return class extends React.Component {
          render() {
            return this.props.children[0];
          }
        };
      });
      lazy('oldChild', () => {
        return React.createElement('div', null, ['old-content']);
      });
      lazy('newChild', () => {
        return React.createElement('div', null, ['new-content']);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [oldChild]),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [newChild]),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>new-content</div></div>'
        );
      });
    });

    describe('when the child type does not match', () => {
      lazy('oldComponent', () => {
        return class extends React.Component {
          render() {
            return this.props.children[0];
          }
        };
      });
      lazy('oldChild', () => {
        return React.createElement('div', null, []);
      });
      lazy('newChild', () => {
        return React.createElement('span', null, []);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [oldChild]),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [newChild]),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><span></span></div>'
        );
      });
    });

    describe('when the type does match', () => {
      lazy('oldComponent', () => {
        return class extends React.Component {
          render() {
            return React.createElement('div', null, [
              ...this.props.children
            ]);
          }
        };
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, ['test']),
          document.querySelector("#container"))
      });

      it('calls componentWillUpdate on the old component', () => {
        spyOn(oldComponent.prototype, 'componentWillUpdate');

        ReactDOM.render(
          React.createElement(
            oldComponent, null, ['test2']),
          document.querySelector("#container"));

        expect(oldComponent.prototype.componentWillUpdate)
          .toHaveBeenCalled();
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, ['test2']),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>test2</div></div>'
        );
      });
    });

    describe('when the type does not match', () => {
      lazy('oldComponent', () => {
        return class extends React.Component {
          render() {
            return React.createElement('div', null, [
              'old-component'
            ]);
          }
        };
      });
      lazy('newComponent', () => {
        return class extends React.Component {
          render() {
            return React.createElement('div', null, [
              'new-component'
            ]);
          }
        };
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent),
          document.querySelector("#container"))
      });

      it('calls componentWillUnmount on the old component', () => {
        spyOn(oldComponent.prototype, 'componentWillUnmount');

        ReactDOM.render(
          React.createElement(
            newComponent),
          document.querySelector("#container"));

        expect(oldComponent.prototype.componentWillUnmount)
          .toHaveBeenCalled();
      });

      it('calls componentWillMount on the new component', () => {
        spyOn(newComponent.prototype, 'componentWillMount');

        ReactDOM.render(
          React.createElement(
            newComponent),
          document.querySelector("#container"));

        expect(newComponent.prototype.componentWillMount)
          .toHaveBeenCalled();
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            newComponent),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>new-component</div></div>'
        );
      });
    });
  });

  describe('setState', () => {
    lazy('buttonId', () => 'some-button-id');
    lazy('component', () => {
      return class extends React.Component {
        constructor(props) {
          super(props);

          this.state = {
            counter: 0
          };
        }

        render() {
          return React.createElement('div', null, [
            React.createElement('button', {
              onClick: () => {
                this.setState({counter: this.state.counter + 1});
              },
              id: this.props.id,
            }, [
              `${this.props.label} Counter: ${this.state.counter}`,
            ]),
            ...this.props.children
          ]);
        }
      };
    });

    beforeEach(() => {
      jest.spyOn(React.Component.prototype, 'setState');
      document.body.innerHTML = '<div id="container"></div>';
    });

    it('can be called within class', () => {
      expect(
        ReactDOM.render(
          React.createElement(
            component, {id: buttonId, label: 'Outer'}),
          document.querySelector("#container")))
        .toEqual(null);

      document.querySelector(`#${buttonId}`).click();

      expect(React.Component.prototype.setState)
        .toHaveBeenCalledWith({counter: 1});
    });

    it('triggers a re-render', () => {
      expect(
        ReactDOM.render(
          React.createElement(
            component, {id: buttonId, label: 'Outer'}),
          document.querySelector("#container")))
        .toEqual(null);

      expect(document.body.innerHTML).toMatch(`Outer Counter: 0`);

      document.querySelector(`#${buttonId}`).click();

      expect(document.body.innerHTML).toMatch(`Outer Counter: 1`);
    });

    describe('when there are nested class components', () => {
      lazy('nestedComponentButtonId', () => 
        'nested-component-button-id');
      lazy('outerCounterLabel', () => 'Outer');
      lazy('innerCounterLabel', () => 'Inner');

      it('preserves descendant component instances', () => {
        expect(
          ReactDOM.render(
            React.createElement(
              component, 
              {id: buttonId, label: outerCounterLabel},
              [
                React.createElement(
                  component, 
                  {id: nestedComponentButtonId, 
                   label: innerCounterLabel}
                )
              ]
            ),
            document.querySelector("#container")))
          .toEqual(null);

        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 0`);

        document.querySelector(`#${nestedComponentButtonId}`).click();

        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 1`);
        expect(document.body.innerHTML)
          .toMatch(`${outerCounterLabel} Counter: 0`);

        document.querySelector(`#${buttonId}`).click();

        expect(document.body.innerHTML)
          .toMatch(`${outerCounterLabel} Counter: 1`);
        expect(document.body.innerHTML)
          .toMatch(`${innerCounterLabel} Counter: 1`);
      });
    });
  });

  describe(
    'returning a string', () => {

    lazy('element', () => {
      return React.createElement(class extends React.Component {
        render() {
          return 'some-content';
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
        '<div id="container">some-content</div>'
      );
    });
  });

  describe(
    'returning html', () => {

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

  describe(
    'passing props', () => {

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
  describe('updating', () => {
    describe('when the child type does match', () => {
      lazy('oldComponent', () => {
        return (props) => {
          return props.children[0];
        }
      });
      lazy('oldChild', () => {
        return React.createElement('div', null, ['old-content']);
      });
      lazy('newChild', () => {
        return React.createElement('div', null, ['new-content']);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [oldChild]),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [newChild]),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>new-content</div></div>'
        );
      });
    });

    describe('when the child type does not match', () => {
      lazy('oldComponent', () => {
        return (props) => {
          return props.children[0];
        }
      });
      lazy('oldChild', () => {
        return React.createElement('div', null, []);
      });
      lazy('newChild', () => {
        return React.createElement('span', null, []);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [oldChild]),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, [newChild]),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><span></span></div>'
        );
      });
    });

    describe('when the type does match', () => {
      lazy('oldComponent', () => {
        return (props) => {
          return React.createElement('div', null, props.children);
        }
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent, null, ['test']),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            oldComponent, null, ['test2']),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>test2</div></div>'
        );
      });
    });

    describe('when the type does not match', () => {
      lazy('oldComponent', () => {
        return (props) => {
          return React.createElement('div', null, [
            'old-component'
          ]);
        }
      });
      lazy('newComponent', () => {
        return (props) => {
          return React.createElement('div', null, [
            'new-component'
          ]);
        }
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          React.createElement(
            oldComponent),
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          React.createElement(
            newComponent),
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>new-component</div></div>'
        );
      });
    });
  });

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
  describe('updating', () => {
    describe('removing a child', () => {
      lazy('ChildClassComponent0', () => {
        return class extends React.Component {
          render() {
            return 'old-content-0';
          }
        }
      });
      lazy('ChildClassComponent1', () => {
        return class extends React.Component {
          render() {
            return 'old-content-1';
          }
        }
      });
      lazy('oldComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            React.createElement(ChildClassComponent0),
            React.createElement(ChildClassComponent1),
          ])
        ]);
      });
      lazy('newComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            React.createElement(ChildClassComponent1),
          ])
        ]);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      it('unmounts the component that was removed', () => {
        spyOn(ChildClassComponent0.prototype, 'componentWillUnmount');

        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(ChildClassComponent0.prototype.componentWillUnmount)
          .toHaveBeenCalled();
      });

      it('updates the components that remain', () => {
        spyOn(ChildClassComponent1.prototype, 'componentWillUpdate');

        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(ChildClassComponent1.prototype.componentWillUpdate)
          .toHaveBeenCalled();
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div><div>old-content-1</div></div></div>'
        );
      });
    });

    describe('prepending a new child', () => {
      lazy('ChildClassComponent0', () => {
        return class extends React.Component {
          render() {
            return 'old-content';
          }
        }
      });
      lazy('ChildClassComponent1', () => {
        return class extends React.Component {
          render() {
            return 'new-content';
          }
        }
      });
      lazy('oldComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            React.createElement(ChildClassComponent0)
          ])
        ]);
      });
      lazy('newComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            React.createElement(ChildClassComponent1),
            React.createElement(ChildClassComponent0),
          ])
        ]);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      xit('mounts the new component', () => {
      });

      xit('updates the old components', () => {
        spyOn(ChildClassComponent0.prototype, 'componentWillUpdate');

        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(ChildClassComponent0.prototype.componentWillUpdate)
          .toHaveBeenCalled();
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div><div>new-contentold-content</div></div></div>'
        );
      });
    });

    describe('when the child type does match', () => {
      lazy('oldComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            'old-content'
          ])
        ]);
      });
      lazy('newComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
            'new-content'
          ])
        ]);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div><div>new-content</div></div></div>'
        );
      });
    });

    describe('when the child type does not match', () => {
      lazy('oldComponent', () => {
        return React.createElement('div', null, [
          React.createElement('div', null, [
          ])
        ]);
      });
      lazy('newComponent', () => {
        return React.createElement('div', null, [
          React.createElement('span', null, [
          ])
        ]);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div><span></span></div></div>'
        );
      });
    });

    describe('when the type does match', () => {
      lazy('oldComponent', () => {
        return React.createElement('div', null, ['content']);
      });
      lazy('newComponent', () => {
        return React.createElement('div', null, ['new-content']);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><div>new-content</div></div>'
        );
      });
    });

    describe('when the type does not match', () => {
      lazy('oldComponent', () => {
        return React.createElement('div', null, [
          'old-component'
        ]);
      });
      lazy('newComponent', () => {
        return React.createElement('span', null, [
          'new-component'
        ]);
      });

      beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';
        ReactDOM.render(
          oldComponent,
          document.querySelector("#container"))
      });

      it('updates the DOM', () => {
        ReactDOM.render(
          newComponent,
          document.querySelector("#container"));

        expect(document.body.innerHTML).toEqual(
          '<div id="container"><span>new-component</span></div>'
        );
      });
    });
  });

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
    describe('html elements', () => {
      renderingHtmlElements();
    });

    describe('functional components', () => {
      renderingFunctionalComponents();
    });

    describe('class components', () => {
      renderingClassComponents();
    });
  });
});

