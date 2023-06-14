import { render } from '@testing-library/react'
import { observer, observable } from '../lib';
import { timer } from 'rxjs';
import { act } from 'react-dom/test-utils';

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
