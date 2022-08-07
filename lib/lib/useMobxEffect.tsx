import { useMount, useUnmount } from 'react-use';
import { Subscription } from 'rxjs';
import { reaction, toJS } from 'mobx'
import { useMobxState } from './useMobxState';
import { useEffect } from 'react';

export const useMobxEffect = (callback: () => void, dependencyList?: any[]): void => {

    const state = useMobxState({
        subscription: new Subscription(),
    }, Object.assign({}, dependencyList))

    const source = useMobxState({}, { callback });

    useEffect(() => {
        if (!dependencyList) {
            callback()
        }
    })

    useMount(() => {
        if (dependencyList) {
            const disposer = reaction(() => [toJS(state)], () => source.callback(), { fireImmediately: true, delay: 1 });

            state.subscription.add(new Subscription(() => {
                disposer();
            }));
        }
    })

    useUnmount(() => {
        state.subscription.unsubscribe();
    })
}