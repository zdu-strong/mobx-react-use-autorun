import { render } from '@testing-library/react'
import { Subscription, timer } from 'rxjs';
import { observer, useMount } from '../lib';

test('', async () => {
  const result = render(<TestComponent />);
  result.unmount();
  await timer(500).toPromise();
  expect(isUnmount).toBeTruthy();
})

const TestComponent = observer(() => {

  useMount((subscription) => {
    subscription.add(new Subscription(() => {
      isUnmount = true;
    }))
  })

  return null;
})

let isUnmount = false;