import { render } from '@testing-library/react'
import { useMobxState } from '../lib';

test('', () => {
    const result = render(<TestComponent />);
    expect(result.container.textContent).toEqual('tom')
})

function TestComponent() {
    const state = useMobxState({ people: { name: "tom" } });

    return <>
        {state.people.name}
    </>;
}