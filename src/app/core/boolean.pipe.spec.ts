import { BooleanPipe } from './boolean.pipe';

const translate = {
  instant: key => key
} as any;

describe('BooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanPipe(translate);
    expect(pipe).toBeTruthy();
  });
});
