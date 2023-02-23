import { render } from '@testing-library/react'
import { observer, useMobxState } from '../lib';

test('', () => {
  const result = render(<TestComponent age={5} />);
  expect(result.container.textContent).toEqual('5')
  result.rerender(<TestComponent />)
  expect(result.container.textContent).toEqual('')
})

const TestComponent = observer((props: { age?: number }) => {
  const state = useMobxState({}, { ...props });

  return <>
    {state.age}
  </>;
})