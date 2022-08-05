import { render } from '@testing-library/react'
import { useMobxState } from '../lib';

test('', () => {
    const result = render(<TestComponent people={{ name: "tom" }} />);
    expect(result.container.textContent).toEqual('tom')
})

function TestComponent(props: { people: { name: string } }) {
    const source = useMobxState({}, { ...props });

    return <>
        {source.people.name}
    </>;
}