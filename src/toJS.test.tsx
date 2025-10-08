import { observable, toJS } from '../lib';

test('', () => {
    const data = observable({ name: 'tom' });
    expect(toJS(data)).toEqual({ name: 'tom' })
})