import { render } from '@testing-library/react';
import { act } from 'react';
import { timer } from 'rxjs';
import { observable, observer } from '../lib';

test('', async () => {
    const result = render(<TestComponent />);
    expect(result.container.textContent).toEqual('tom')
    await timer(1).toPromise();
    act(() => {
        globalData.people.name = 'jerry'
    })
    await timer(1).toPromise();
    expect(result.container.textContent).toEqual('jerry')
})

const TestComponent = observer(() => {
    return <>
        {globalData.people.name}
    </>;
})

const globalData = observable({ people: { name: "tom" } })
