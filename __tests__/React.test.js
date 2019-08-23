
import React from '../src/react';
import lazy from 'jasmine-lazy';

describe('React', () => {
  describe('createElement', () => {
    describe('when the type is a tag name', () => {
      lazy('type', () => 'div');

      it('returns an element of the given type', () => {
        expect(React.createElement(type))
          .toEqual({
            type: 'div',
            props: {children: []}
          });
      });
    });

    describe('when the type is a functional component', () => {
      lazy('type', () => () => {
        return {
          type: 'div',
          props: {children: []}
        }
      });

      it('returns an element of the given type', () => {
        expect(React.createElement(type))
          .toEqual({
            type: expect.any(Function),
            props: {children: []}
          });
      });
    });

    describe('when there are props', () => {
      lazy('type', () => 'div');
      lazy('expectedProps', () => ({
        id: 'test-id',
        className: 'some-class-name'
      }));

      it('adds the props to the element', () => {
        expect(React.createElement(type, expectedProps))
          .toEqual({
            type: 'div',
            props: {children: [], ...expectedProps}
          });
      });
    });

    describe('when there are children', () => {
      describe('when the children are strings', () => {
        lazy('type', () => 'div');
        lazy('children', () => ['test']);

        it('returns nested elements', () => {
          expect(React.createElement(type, null, children))
            .toEqual({
              type: 'div',
              props: {
                children: ['test']
              }
            });
        });
      });

      describe('when the children are elements', () => {
        lazy('type', () => 'div');
        lazy('children', () => [
          {
            type: 'div',
            props: {
              children: ['test']
            }
          }
        ]);

        it('returns nested elements', () => {
          expect(React.createElement(type, null, children))
            .toEqual({
              type: 'div',
              props: {
                children: [
                  {
                    type: 'div',
                    props: {
                      children: ['test']
                    }
                  }
                ]
              }
            });
        });
      });
    });
  });
});

