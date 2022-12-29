import { render } from '@testing-library/react'
import { timer } from 'rxjs';
import { observer, useMobxEffect, useMobxState } from '../lib';

test('', async () => {
    const result = render(<TestComponent people={{ name: "tom" }} />);
    result.rerender(<TestComponent people={{ name: "jerry" }} />)
    await timer(500).toPromise();
    expect(globalName).toEqual('jerry')
})

const TestComponent = observer((props: { people: { name: string } }) => {
    const state = useMobxState({}, { ...props });

    useMobxEffect(() => {
        globalName = state.people.name;
    }, [state.people.name])

    return <>
        {state.people.name}
    </>;
})

let globalName = '';