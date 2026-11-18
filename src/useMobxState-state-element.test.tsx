import { render } from '@testing-library/react'
import { observer, useMobxState } from '../lib';
import { StrictMode } from "react";

test('', () => {
    const result = render(<TestComponent food="apple" />);
    result.rerender(<TestComponent food="banana" />);
    expect(result.container.textContent).toEqual('tom eat banana')
})

type Props = {
    food: string;
}

const TestComponent = observer((props: Props) => {

    const state = useMobxState({
        userList: [
            {
                id: "tom",
                name: <div>{"tom"}</div>
            }
        ]
    });

    return <StrictMode>
        {state.userList.map(user => <div key={user.id}>
            {user.name}
            {` eat ${props.food}`}
        </div>)}
    </StrictMode>
})