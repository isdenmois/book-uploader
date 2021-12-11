import { mockObject } from './mock'

export const localStorage = mockObject(global, 'localStorage', {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
})
