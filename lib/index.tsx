import './lib/mobx_config'
import { toJS, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMobxEffect } from './lib/useMobxEffect';
import { useMobxState } from './lib/useMobxState';

export { toJS, observable, observer }
export { useMobxEffect, useMobxState }