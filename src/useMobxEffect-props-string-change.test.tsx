import { render } from '@testing-library/react'
import { timer } from 'rxjs';
import { observer, useMobxEffect, useMobxState } from '../lib';

test('', async () => {
  const result = render(<TestComponent name="tom" />);
  result.rerender(<TestComponent name={"jerry"} />)
  await timer(500).toPromise();
  expect(globalName).toEqual('jerry')
})

const TestComponent = observer((props: { name: string }) => {
  const state = useMobxState({}, { ...props });

  useMobxEffect(() => {
    globalName = state.name;
  }, [state.name])

  return <>
    {state.name}
  </>;
})

let globalName = '';