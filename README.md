Provide concise usage for mobx in react<br/>

# `Installation`

    npm install mobx-react-use-autorun

# `Usage`

### Define state with useMobxState

    import { useMobxState, observer } from 'mobx-react-use-autorun';
    import { useRef } from 'react';

    export default observer((props: {name: string}) => {

        const state = useMobxState({
            age: 16
        }, {
            ...props,
            divRef: useRef<any>()
        });

        return <div
            ref={state.divRef}
            onClick={() => state.age++}
        >
            {`${state.name}'s age is ${state.age}`}
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

### Subscription property changes with useMobxEffect

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

### Lifecycle hook with useMount

useMount is a lifecycle hook that calls a function after the component is mounted.<br/>
It provides a subscription as parameter, which will be unsubscribed when the component will unmount.<br/>

It support Strict Mode.<br/>
Strict Mode: In the future, React will provide a feature that lets components preserve state between unmounts. To prepare for it, React 18 introduces a new development-only check to Strict Mode. React will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount. If this breaks your app, consider removing Strict Mode until you can fix the components to be resilient to remounting with existing state.<br/>

    import { Subscription } from 'rxjs'
    import { observer, useMount } from 'mobx-react-use-autorun'

    export default observer(() => {

        useMount((subscription) => {
            console.log('component is loaded')

            subscription.add(new Subscription(() => {
                console.log("component will unmount")
            }))
        })

        return null;
    })

### Define global mutable data with observable

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

### Get the real data of the proxy object with toJS

"toJS" will cause the component to re-render when data changes.<br/>
Please do not execute "toJS(state)" in component rendering code, it may cause repeated rendering.<br/>
Wrong Example:<br/>

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
            console.log(toJS(state));
            console.log(toJS(state.name));
        })

        console.log(toJS(state.name));

        return <button
          onClick={() => {
            console.log(toJS(state));
            console.log(toJS(state.name));
          }}
        >
          {'Click Me'}
        </button>;
    })

# Notes - Work with non-observer components

Non-observer components cannot trigger re-rendering when the following data changes, please use "toJS" to do it.<br/>
* array<br/>
* object<br/>
* The all data used in the new render callback<br/>

<br/>

    import { observer, toJS, useMobxState } from "mobx-react-use-autorun";
    import { v1 } from "uuid";
    import { Virtuoso } from 'react-virtuoso'

    export default observer(() => {

      const state = useMobxState({
        userList: [{ id: 1, username: 'Tom' }]
      })

      toJS(state.userList)

      return <Virtuoso
        style={{ width: "500px", height: "200px" }}
        data={state.userList}
        itemContent={(index, item) =>
          <div key={item.id} onClick={() => item.username = v1()}>
            {item.username}
          </div>
        }
      />
    })

# Notes - Work with typedjson

Typedjson is a strongly typed reflection library.<br/>

    import { makeAutoObservable, toJS } from "mobx-react-use-autorun";
    import { TypedJSON, jsonMember, jsonObject } from "typedjson";

    @jsonObject
    export class UserModel {

      @jsonMember(String)
      username!: string;

      @jsonMember(Date)
      createDate!: Date;

      constructor() {
        makeAutoObservable(this);
      }
    }

    const user = new TypedJSON(UserModel).parse(`{"username":"tom","createDate":"2023-04-13T04:21:59.262Z"}`);
    console.log(toJS(user));

    console.log(toJS(new TypedJSON(UserModel).parse({
      username: "tom",
      createDate: "2023-04-13T04:21:59.262Z"
    })))

# Learn More

1. A JavaScript library for building user interfaces (https://react.dev)<br/>
2. Reactive Extensions Library for JavaScript (https://www.npmjs.com/package/rxjs)
3. Material UI is a library of React UI components that implements Google's Material Design (https://mui.com)

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

Publish to npm repository<br/>

Pre-step, please run<br/>

    npm login --registry https://registry.npmjs.org

# License

This project is licensed under the terms of the [MIT license](./LICENSE).