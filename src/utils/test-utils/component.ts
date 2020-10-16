import { createElement } from 'react';

export function mockComponent(name) {
  return ({ children, ...props }) => {
    return createElement(name, props, children);
  };
}
