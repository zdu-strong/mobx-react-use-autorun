import { useLocalObservable } from 'mobx-react-lite';
import { useMount, useUnmount } from 'react-use';
import { Subscription } from 'rxjs';
import { useAsLocalSource } from './useAsLocalSource';
import { reaction, toJS } from 'mobx'

export const useAutorun = (callback: () => void, dependencyList: any[]): void => {

    const state = useLocalObservable(() => ({
        subscription: new Subscription(),
    }))

    const dependencyListSource = useAsLocalSource(Object.assign({}, dependencyList))

    const source = useAsLocalSource({ callback });

    useMount(() => {
        const disposer = reaction(() => [toJS(dependencyListSource)], () => source.callback(), { fireImmediately: true, delay: 1 });

        state.subscription.add(new Subscription(() => {
            disposer();
        }));
    })

    useUnmount(() => {
        state.subscription.unsubscribe();
    })
}