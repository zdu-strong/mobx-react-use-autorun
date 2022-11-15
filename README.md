# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you have any questions, please contact zdu.strong@gmail.com.<br/>

## Development environment setup
1. From https://code.visualstudio.com install Visual Studio Code.<br/>
2. From https://nodejs.org install nodejs v16.<br/>

## Available Scripts

In the project directory, you can run:<br/>

### `npm test`

Run all unit tests.<br/>

### `npm run build`

Builds the files for production to the `dist` folder.<br/>

### `npm run make`

Publish to npm repository

## Notes - Define state and props with useMobxState

    import { useMobxState, observer } from 'mobx-react-use-autorun';
    import { useRef } from 'react';

    export default observer((props: {name: string}) => {

        const state = useMobxState({
            randomNumber: 1
        }, {
            ...props,
            divRef: useRef<any>()
        });

        return <div
            ref={state.divRef}
            onClick={() => state.randomNumber = Math.random()}
        >
            {state.randomNumber}
        </div>
    })

more usage:<br/>
Form validation<br/>

    import { Button, TextField } from '@mui/material';
    import { observer, useMobxState } from 'mobx-react-use-autorun';
    import { MessageService } from '../../common/MessageService';

    export default observer(() => {

        const state = useMobxState(() => ({
            name: "",
            submit: false,
            errors: {
                get name() {
                    return state.submit &&
                        !state.name &&
                        "Please fill in the username";
                },
                get hasError() {
                    return Object.keys(state.errors)
                        .filter(s => s !== "hasError")
                        .some(s => (state.errors as any)[s]);
                }
            }
        }));

        async function ok(){
            state.submit = true;
            if (state.errors.hasError) {
                MessageService.error("Error");
            } else {
                MessageService.success("Submitted successfully");
            }
        }

        return (<div className='flex flex-col' style={{ padding: "2em" }}>
            <TextField
                value={state.name}
                label="Username"
                onChange={(e) => state.name = e.target.value}
                error={!!state.errors.name}
                helperText={state.errors.name}
            />
            <Button
                variant="contained"
                style={{ marginTop: "2em" }}
                onClick={ok}
            >Submit</Button>
        </div>)
    })

useMobxState provides two usages.<br/>

The first:

    useMobxState({
        name: 'tom',
        age: 16
    }, {
        ...props,
        init: useIntl(),
    })

is easy to use, you can define state and third-party hooks.<br/>

The second:

    useMobxState(() => ({
        get myInfo(){
            return `${state.name}'s age is ${state.age}`
        },
        name: 'tom',
        age: 13,
    }), {
        ...props,
        intl: useIntl(),
    })

 provides advanced usage, the state is executed only once, and the performance is better. At the same time, you can use the get computed property to recalculate when the computed value changes.<br/>

## Notes - Subscription property changes with useMobxEffect

    import { useMobxState, observer } from 'mobx-react-use-autorun';
    import { useMobxEffect, toJS } from 'mobx-react-use-autorun'

    export default observer(() => {

        const state = useMobxState({ randomNumber: 1 });

        useMobxEffect(() => {
            console.log(toJS(state))
        }, [state.randomNumber])

        return <div onClick={() => state.randomNumber = Math.random()}>
            {state.randomNumber}
        </div>
    })

## Notes - Get the real data of the proxy object with toJS

toJS will cause data to be used, please do not execute toJS(state) in component rendering code, it may cause repeated rendering. Wrong Usage Demonstration:<br/>

    import { toJS, observer, useMobxState } from 'mobx-react-use-autorun'
    import { v1 } from 'uuid'

    export default observer(() => {

        const state = useMobxState({}, {
            id: v1()
        })

        toJS(state)

        return null;
    })

Other than that, all usages are correct. Example:<br/>

    import { toJS, useMobxEffect } from 'mobx-react-use-autorun';
    import { observer, useMobxState } from 'mobx-react-use-autorun';
    import { v1 } from 'uuid'

    export default observer(() => {

        const state = useMobxState({}, {
            name: v1()
        });

        useMobxEffect(() => {
            console.log(toJS(state))
        })

        console.log(toJS(state.name))

        return <button onClick={() => console.log(toJS(state))}>{'Click Me'}</button>;
    })

## Notes - Define global mutable data

    import { observable } from 'mobx-react-use-autorun';

    export const globalState = observable({
        age: 15
        name: 'tom'
    });

    export async function setName(name: string){
        globalState.name = name
    }

## Introduction to third-party hooks

useMount is executed when the component loaded.<br/>
useUnmount is executed when the component is unmount.<br/>

    import { useMount, useUnmount } from 'react-use'
    import { Subscription, of, tap } from 'rxjs'
    import { useMobxState, observer } from 'mobx-react-use-autorun'

    export default observer(() => {

        const state = useMobxState({
            subscription: new Subscription()
        })

        useMount(() => {
            state.subscription.add(of(null).pipe(
                tap(() => {
                    console.log('component is loaded')
                })
            ).subscribe())
        })

        useUnmount(() => {
            state.subscription.unsubscribe()
        })

        return null;
    })

## Learn More

1. React UI framework (https://reactjs.org)<br/>
2. React hooks (https://www.npmjs.com/package/react-use)<br/>

## License

This project is licensed under the terms of the [MIT license](./LICENSE).