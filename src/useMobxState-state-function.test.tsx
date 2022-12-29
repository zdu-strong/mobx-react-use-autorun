import { render } from '@testing-library/react'
import { observer, useMobxState } from '../lib';

test('', () => {
    const result = render(<TestComponent />);
    expect(result.container.textContent).toEqual('tom')
})

const TestComponent = observer(() => {
    const state = useMobxState(() => ({ people: { name: "tom" } }));

    return <>
        {state.people.name}
    </>;
});