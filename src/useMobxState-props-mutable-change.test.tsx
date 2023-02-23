import { render } from '@testing-library/react'
import { observable, observer, useMobxState } from '../lib';

test('', () => {
    let people = observable({ name: "tom" });
    const result = render(<TestComponent people={people} />);
    expect(result.container.textContent).toEqual('tom')
    people = observable({ name: "jerry" });
    result.rerender(<TestComponent people={people} />)
    expect(result.container.textContent).toEqual('jerry')
})

const TestComponent = observer((props: { people: { name: string } }) => {
    const state = useMobxState({}, { ...props });

    return <>
        {state.people.name}
    </>;
})