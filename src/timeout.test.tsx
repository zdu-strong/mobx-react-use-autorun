import { timeout } from '../lib/index'

let startDate = null as Date | null;

test('Expect timeout as a promise to return after one second', async () => {
    await timeout(1000)
    expect(new Date().getTime()).toBeGreaterThanOrEqual(startDate!.getTime())
})

beforeAll(() => {
    startDate = new Date();
})
