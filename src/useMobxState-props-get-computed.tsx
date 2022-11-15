import { render } from '@testing-library/react'
import { useMobxState } from '../lib';

test('', () => {
    const result = render(<TestComponent people={{ name: "tom" }} />);
    result.rerender(<TestComponent people={{ name: "jerry" }} />)
    expect(result.container.textContent).toEqual('jerry')
})

function TestComponent(props: { people: { name: string } }) {
    const state = useMobxState(()=>({
        get firstName() {
            return state.people.name;
        }
    }), {
        ...props,
    });

    return <>
        {state.firstName}
    </>;
}