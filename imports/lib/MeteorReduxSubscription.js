import { Meteor } from 'meteor/meteor';
import { startSubscription, STOP_SUBSCRIPTION } from 'meteor-redux-middlewares';

const initialState = {
  ready: false,
  item: null,
  stopped: false,
};

export const reducers = {};

export class MeteorReduxSubscription {
  constructor(props) {
    this.start = (params) =>
      startSubscription({
        key: props.name,
        get: () => (params) ? props.run(params) : props.run({}),
        subscribe: () => Meteor.subscribe(props.subscription),
      });

    const actionStub = props.name.toUpperCase();

    this.reducer = (state = initialState, action) => {
      switch (action.type) {
        case `${actionStub}_SUBSCRIPTION_READY`:
          return {
            ...state,
            ready: action.payload.ready,
          };
        case `${actionStub}_SUBSCRIPTION_CHANGED`:
          // this conditional is attempting to not overwrite offline persisted state
          // with an empty set while the subscription is starting up but not ready
          // so it only applies the payload to store if it's non-empty
          return (state.ready || (action.payload && (action.payload.length || action.payload._id))) ?
            { ...state, item: action.payload, stopped: false }
            : state;
        case STOP_SUBSCRIPTION:
          return action.payload === actionStub ?
            { ...state, stopped: true }
            : state;
        default:
          return state;
      }
    };

    reducers[props.name] = this.reducer;
  }
}
