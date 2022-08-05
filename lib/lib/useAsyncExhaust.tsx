import { toJS } from 'mobx';
import { useRef } from 'react';
import { useMount, useUnmount } from 'react-use';
import { catchError, concatMap, debounceTime, EMPTY, from, lastValueFrom, ReplaySubject, Subscription } from 'rxjs';
import { exhaustMapWithTrailing } from 'rxjs-exhaustmap-with-trailing';
import { useMobxState } from './useMobxState';

export function useAsyncExhaust<T>(callback: T) {

    const runCallback: any = function () {
        if (state.isUnmount) {
            const resultSubjectPromise = Promise.reject(new Error("Cancelled!"));
            resultSubjectPromise.catch(() => null);
            return resultSubjectPromise;
        } else {
            const resultSubject = new ReplaySubject(0);
            const resultSubjectPromise = lastValueFrom(resultSubject);
            state.resultSubjectList.push({
                subject: resultSubject,
                promise: resultSubjectPromise
            });
            state.subject.next({
                params: arguments
            });
            return resultSubjectPromise;
        }
    }

    const state = useRef({
        subscription: new Subscription(),
        subject: new ReplaySubject(0),
        resultSubjectList: [] as {
            subject: ReplaySubject<any>,
            promise: Promise<any>,
        }[],
        isUnmount: false,
    }).current;

    const source = useMobxState({}, { callback });

    useMount(() => {
        state.subscription.add(state.subject.pipe(
            debounceTime(0),
            exhaustMapWithTrailing(({ params }: any) => {
                const resultSubjectList = toJS(state.resultSubjectList);
                return from((async () => { return await (source.callback as any)(...params) })()).pipe(
                    concatMap((result) => {
                        for (const resultSubject of resultSubjectList) {
                            resultSubject.subject.next(result);
                            resultSubject.subject.complete();
                            if (resultSubject.subject.closed) {
                                const index = state.resultSubjectList.findIndex(s => s === resultSubject);
                                if (index >= 0) {
                                    state.resultSubjectList.splice(index, 1);
                                }
                            }
                        }
                        return EMPTY;
                    }),
                    catchError((error) => {
                        for (const resultSubject of resultSubjectList) {
                            resultSubject.subject.error(error);
                            if (resultSubject.subject.closed) {
                                const index = state.resultSubjectList.findIndex(s => s === resultSubject);
                                if (index >= 0) {
                                    state.resultSubjectList.splice(index, 1);
                                }
                            }
                        }
                        return EMPTY;
                    })
                );
            }),
        ).subscribe());
    })

    useUnmount(() => {
        state.subscription.unsubscribe();
        state.isUnmount = true;
        for (const resultSubject of toJS(state.resultSubjectList)) {
            resultSubject.promise.catch(() => null);
            resultSubject.subject.error(new Error("Cancelled!"));
            if (resultSubject.subject.closed) {
                const index = state.resultSubjectList.findIndex(s => s === resultSubject);
                if (index >= 0) {
                    state.resultSubjectList.splice(index, 1);
                }
            }
        }
    })

    return runCallback as T;
}