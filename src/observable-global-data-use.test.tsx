import { render } from '@testing-library/react'
import { observer } from '../lib';
import { observable } from 'mobx'

test('', async () => {
    const result = render(<TestComponent />);
    expect(result.container.textContent).toEqual('tom')
})

const TestComponent = observer(() => {
    return <>
        {globalData.people.name}
    </>;
})

const globalData = observable({ people: { name: "tom" } })
