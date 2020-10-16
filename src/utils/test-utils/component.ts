import { createElement } from 'react';

export function mockComponent(name): any {
  return ({ children, ...props }) => {
    return createElement(name, props, children);
  };
}
