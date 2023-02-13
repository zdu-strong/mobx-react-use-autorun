Provide concise usage for mobx in react<br/>

# `Installation`

    npm install mobx-react-use-autorun

# `Usage`

### Notes - Define state and props with useMobxState

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

    export default observer(() => {

        const state = useMobxState({
            name: "",
            submit: false,
            errors: {
                name() {
                    return state.submit &&
                        !state.name &&
                        "Please fill in the username";
                },
                hasError() {
                    return Object.keys(state.errors)
                        .filter(s => s !== "hasError")
                        .some(s => (state.errors as any)[s]());
                }
            }
        });

        async function ok(){
            state.submit = true;
            if (state.errors.hasError()) {
                console.log("Submission Failed");
            } else {
                console.log("Submitted successfully");
            }
        }

        return (<div className='flex flex-col' style={{ padding: "2em" }}>
            <TextField
                value={state.name}
                label="Username"
                onChange={(e) => state.name = e.target.value}
                error={!!state.errors.name()}
                helperText={state.errors.name()}
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
        age: 16,
        myInfo(){
            return `${state.name}'s age is ${state.age}`
        },
    }, {
        ...props,
        intl: useIntl(),
    })

is easy to use, you can define state, props and third-party hooks.<br/>

The second:

    useMobxState(() => ({
        name: 'tom',
        age: 13,
        myInfo(){
            return `${state.name}'s age is ${state.age}`
        },
    }), {
        ...props,
        intl: useIntl(),
    })

Provide a method to generate state, the state is executed only once, and the performance is better.<br/>

### Notes - Subscription property changes with useMobxEffect

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

### Notes - Get the real data of the proxy object with toJS

toJS will cause data to be used, please do not execute toJS(state) in component rendering code, it may cause repeated rendering.<br/>
Wrong Usage Demonstration:<br/>

    import { toJS, observer, useMobxState } from 'mobx-react-use-autorun'
    import { v1 } from 'uuid'

    export default observer(() => {

        const state = useMobxState({}, {
            id: v1()
        })

        toJS(state)

        return null;
    })

Other than that, all usages are correct.<br/>
Correct Example:<br/>

    import { toJS, useMobxEffect } from 'mobx-react-use-autorun';
    import { observer, useMobxState } from 'mobx-react-use-autorun';
    import { v1 } from 'uuid'

    export default observer(() => {

        const state = useMobxState({
            name: v1()
        });

        useMobxEffect(() => {
            console.log(toJS(state))
        })

        console.log(toJS(state.name))

        return <button onClick={() => console.log(toJS(state))}>{'Click Me'}</button>;
    })

### Notes - Define global mutable data with observable

    import { observable } from 'mobx-react-use-autorun';

    export const globalState = observable({
        age: 15,
        name: 'tom'
    });

    export async function setAge(age: number) {
        globalState.age = age
    }

    import { observer } from "mobx-react-use-autorun";
    import { setAge, globalState } from "./GlobalState";

    export default observer(() => {
        return <div
            onClick={() => {
                setAge(globalState.age + 1)
            }}
        >
            {`${globalState.name}'s age is ${globalState.age}.`}
        </div>;
    })

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

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you have any questions, please contact zdu.strong@gmail.com.<br/>

## Development environment setup
1. From https://code.visualstudio.com install Visual Studio Code.<br/>
2. From https://nodejs.org install nodejs v18.<br/>

## Available Scripts

In the project directory, you can run:<br/>

### `npm test`

Run all unit tests.<br/>

### `npm run build`

Builds the files for production to the `dist` folder.<br/>

### `npm run make`

Publish to npm repository

# Learn More

1. React UI framework (https://reactjs.org)<br/>
2. Reactive Extensions Library for JavaScript (https://www.npmjs.com/package/rxjs)
3. Material UI is a library of React UI components that implements Google's Material Design (https://mui.com)

# License

This project is licensed under the terms of the [MIT license](./LICENSE).