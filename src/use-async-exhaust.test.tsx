import { useAsyncExhaust, timeout } from '../lib/index'
import { render } from '@testing-library/react'
import { useMount } from 'react-use';

let runTimes = 0;

test('Expect useAsyncExhaust to run only once when it is called consecutively', async () => {
    render(<TestComponent />);
    await timeout(1500);
    expect(runTimes).toEqual(1)
})

function TestComponent() {

    const search = useAsyncExhaust(async () => {
        await timeout(1000);
        runTimes++;
    })

    useMount(() => {
        search();
        search();
        search();
        search();
        search();
        search();
    })

    return <>
        null
    </>;
}