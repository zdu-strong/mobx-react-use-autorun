# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you have any questions, please contact zdu.strong@gmail.com.<br/>

## Development environment setup
1. From https://code.visualstudio.com install Visual Studio Code.<br/>
2. From https://nodejs.org/en/ install nodejs v16.<br/>

## Available Scripts

In the project directory, you can run:<br/>

### `npm test`

Run all unit tests.<br/>


### `npm run build`

Builds the files for production to the `dist` folder.<br/>

### `npm publish`

Publish to npm repository

## Notes - Define state with useLocalObservable

    import { useLocalObservable, observer } from 'mobx-react-use-autorun';

    export default observer(() => {

        const state = useLocalObservable(() => ({ randomNumber: 1 }));

        return <div onClick={() => state.randomNumber = Math.random()}>
            {state.randomNumber}
        </div>
    })

more usage:<br/>
Form validation<br/>

    import { Button, TextField } from '@mui/material';
    import { observer, useLocalObservable } from 'mobx-react-use-autorun';
    import { MessageService } from '../../common/MessageService';

    export default observer(() => {

        const state = useLocalObservable(() => ({
            name: "",
            submit: false,
            errors: {
                get name() {
                    return state.submit && !state.name && "请填写名称";
                },
                get hasError() {
                    return state.errors.name;
                }
            }
        }));

        const ok = async () => {
            state.submit = true;
            if (state.errors.hasError) {
                MessageService.error("错误");
            } else {
                MessageService.success("提交成功");
            }
        }

        return (<div className='flex flex-col' style={{ padding: "2em" }}>
            <TextField value={state.name} label="用户名" onChange={(e) => state.name = e.target.value} error={!!state.errors.name} helperText={state.errors.name} />
            <Button variant="contained" style={{ marginTop: "2em" }} onClick={ok} >提交</Button>
        </div>)
    })

## Notes - Using props and other hooks with useAsLocalSource

    import { observer, useAsLocalSource } from 'mobx-react-use-autorun';
    import { useLocation } from 'react-router-dom';

    export default observer((props: { name: string }) => {

        const source = useAsLocalSource({ location: useLocation(), ...props });

        return <div>
            {source.name}
            {source.location.pathname}
        </div>
    })

## Notes - Subscription property changes with useAutorun

    import { useLocalObservable, observer, useAutorun, toJS } from 'mobx-react-use-autorun';

    export default observer(() => {

        const state = useLocalObservable(() => ({ randomNumber: 1 }));

        useAutorun(() => {
            console.log(toJS(state))
        }, [state]);

        return <div onClick={() => state.randomNumber = Math.random()}>
            {state.randomNumber}
        </div>
    })

## Notes - Ignore frequent asynchronous calls with useAsyncExhaust

    import { TextField } from "@mui/material";
    import { useLocalObservable, observer, useAsyncExhaust } from 'mobx-react-use-autorun';
    import axios from 'axios';

    export default observer(() => {

        const state = useLocalObservable(() => ({
            list: [],
            searchText: ""
        }));

        const search = useAsyncExhaust(async () => {
            state.list = await axios.get("/search");
        });

        return (
            <TextField
                label="Please enter search content"
                variant="outlined"
                value={state.searchText}
                onChange={(e) => {
                    state.searchText = e.target.value;
                    search();
                }}
            />
        );
    })

## Notes - Define global mutable data

    import { observable } from 'mobx-react-use-autorun';

    const state = observable({});

## Notes - Define a delayed promise with timeout

    import { timeout } form 'mobx-react-use-autorun';

    async function(){
        await timeout(100);
        await timeout(new Date());
    }

## Notes - Get the real data of the proxy object with toJS

    import { observable, toJS } from 'mobx-react-use-autorun';

    const state = observable({});
    console.log(toJS(state));

## Learn More

1. React UI framework (https://reactjs.org)<br/>
2. React hooks (https://www.npmjs.com/package/react-use)<br/>