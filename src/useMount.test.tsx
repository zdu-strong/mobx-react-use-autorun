import { render } from '@testing-library/react'
import { timer } from 'rxjs';
import { observer, useMobxState, useMount } from '../lib';

test('', async () => {
    const result = render(<TestComponent />);
    result.rerender(<TestComponent />)
    await timer(500).toPromise();
    expect(result.container.textContent).toEqual('17')
    result.unmount();
})

const TestComponent = observer(() => {
    const state = useMobxState({
        age: 16
    });

    useMount(() => {
        state.age++;
    })

    return <>
        {state.age}
    </>;
})