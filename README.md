# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you have any questions, please contact zdu.strong@gmail.com.<br/>

## Development environment setup
1. From https://code.visualstudio.com install Visual Studio Code.<br/>
2. From https://nodejs.org/en/ install nodejs v16.<br/>

## Available Scripts

In the project directory, you can run:<br/>

### `npm test`

Pre-step, please run<br/>

    npm install

Run all unit tests.<br/>

### `npm run build`

Pre-step, please run<br/>

    npm install

Builds the files for production to the `dist` folder.<br/>

### `npm publish`

Pre-step, please run<br/>

    npm install

Publish to npm repository

## Notes - Define state and props with useMobxState

    import { useMobxState, observer } from 'mobx-react-use-autorun';

    export default observer((props: {name: string}) => {

        const state = useMobxState({ randomNumber: 1 }, {...props});

        return <div onClick={() => state.randomNumber = Math.random()}>
            {state.randomNumber}
        </div>
    })

more usage:<br/>
Form validation<br/>

    import { Button, TextField } from '@mui/material';
    import { observer, useMobxState } from 'mobx-react-use-autorun';
    import { MessageService } from '../../common/MessageService';

    export default observer(() => {

        const state = useMobxState({
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
        });

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

## Notes - Subscription property changes with useMobxEffect

    import { useMobxState, observer, useMobxEffect, toJS } from 'mobx-react-use-autorun';

    export default observer(() => {

        const state = useMobxState({ randomNumber: 1 });

        useMobxEffect(() => {
            console.log(toJS(state))
        }, [state]);

        return <div onClick={() => state.randomNumber = Math.random()}>
            {state.randomNumber}
        </div>
    })

## Notes - Define global mutable data

    import { observable } from 'mobx-react-use-autorun';

    const state = observable({});

## Notes - Get the real data of the proxy object with toJS

    import { observable, toJS } from 'mobx-react-use-autorun';

    const state = observable({});
    console.log(toJS(state));

## Learn More

1. React UI framework (https://reactjs.org)<br/>
2. React hooks (https://www.npmjs.com/package/react-use)<br/>

## License

This project is licensed under the terms of the [MIT license](./LICENSE).