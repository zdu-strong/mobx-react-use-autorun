import { render } from '@testing-library/react'
import { useMobxState } from '../lib';
import { isObservable, observable } from 'mobx'

test('', () => {
    render(<TestComponent data={initData} />);
    expect(isObservable(lastData)).toBeTruthy()
})

function TestComponent(props: { data: { people: { name: string } } }) {
    const state = useMobxState(() => ({ people: { name: "tom" } }), {
        ...props
    });

    lastData = state.data;

    return <>
        {state.people.name}
    </>;
}

const initData = observable({ people: { name: "tom" } })
let lastData = { } as any;