import { useAsLocalSource } from '../lib/index'
import { render } from '@testing-library/react'

test('Expect useAsLocalSource to pass props', () => {
    const result = render(<TestComponent people={{ name: 'tom' }} />);
    expect(result.container.textContent).toEqual('tom')
})

function TestComponent(props: {people:{name: string}}) {
    const source = useAsLocalSource(props)
    return <>
        {source.people.name}
    </>;
}