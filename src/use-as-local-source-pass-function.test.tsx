import { useAsLocalSource } from '../lib/index'
import { render } from '@testing-library/react'

test('Expect useAsLocalSource to pass function', () => {
    const result = render(<TestComponent />);
    expect(result.container.textContent).toEqual('200')
})

function TestComponent() {
    const source = useAsLocalSource({ callback() { return 200 } })
    return <>
        {source.callback()}
    </>;
}