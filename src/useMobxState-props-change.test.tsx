import { render } from '@testing-library/react'
import { observer, useMobxState } from '../lib';

test('', () => {
    const result = render(<TestComponent people={{ name: "tom" }} />);
    expect(result.container.textContent).toEqual('tom')
    result.rerender(<TestComponent people={{ name: "jerry" }} />)
    expect(result.container.textContent).toEqual('jerry')
})

const TestComponent = observer((props: { people: { name: string } }) => {
    const state = useMobxState({}, { ...props });

    return <>
        {state.people.name}
    </>;
})