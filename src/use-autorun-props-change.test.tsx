import { useAsLocalSource, useAutorun, timeout } from '../lib/index'
import { render } from '@testing-library/react'

let renderTimes = 0;
let runTimes = 0;

test('Expect useAsLocalSource to pass changed props', async () => {
  const result = render(<TestComponent people={{ name: 'tom', age: 16 }} />);
  await timeout(2);
  expect(renderTimes).toEqual(1)
  expect(runTimes).toEqual(1)
  result.rerender(<TestComponent people={{ name: 'tom', age: 17 }} />);
  await timeout(1);
  expect(renderTimes).toEqual(2)
  expect(runTimes).toEqual(1)
})

function TestComponent(props: { people: { name: string, age: number } }) {
  renderTimes++;

  const source = useAsLocalSource(props)

  useAutorun(() => {
    runTimes++;
  }, [source.people.name])

  return <>
    {source.people.name}
  </>;
}