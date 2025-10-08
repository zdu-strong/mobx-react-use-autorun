import { render } from '@testing-library/react'
import { from, ReplaySubject, timer } from 'rxjs';
import { observer, toJS, useMobxEffect, useMobxState, useMount } from '../lib';
import { exhaustMapWithTrailing } from "rxjs-exhaustmap-with-trailing";
import { act } from 'react';

test('', async () => {
    const result = render(<TestComponent name="tom" />);
    result.rerender(<TestComponent name={"jerry"} />);
    for (let i = 100; i > 0; i--) {
        await timer(1).toPromise();
    }
    expect(globalTriggerTimes).toEqual(2)
})

const TestComponent = observer((props: { name: string }) => {

    const state = useMobxState(() => ({
        subject: new ReplaySubject<void>(1),
        error: null as any,
        hasInitAccessToken: false,
    }), {
        ...props
    })

    useMount(async (subscription) => {
        subscription.add(state.subject.pipe(
            exhaustMapWithTrailing(() => from((async () => {
                try {
                    await act(() => {
                        state.error = null;
                    });

                    await handleIsAutoSignIn();
                } catch (error) {
                    await act(() => {
                        state.error = error;
                    });
                }
            })()))
        ).subscribe());
    })

    useMobxEffect(() => {
        state.subject.next();
    }, [state.name])

    async function handleIsAutoSignIn() {
        throw new Error("Network Error");
    }

    useMobxEffect(() => {
        globalTriggerTimes++;
    }, [state.name])

    toJS(state.error);

    return <>
        {state.name}
    </>;
})

let globalTriggerTimes = 0;
