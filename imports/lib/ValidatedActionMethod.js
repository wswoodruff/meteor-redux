import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

export const meteorActionCreator = function(methodOptions) {
  const newMethodOptions = methodOptions;

  newMethodOptions.action = function(args) {
    return async (dispatch) => {
      dispatch({
        type: `${methodOptions.name}/begin`,
      });

      try {
        const payload = await this.callPromise(args);

        dispatch({
          type: `${methodOptions.name}/success`,
          payload,
        });

        return payload;
      } catch (err) {
        dispatch({
          type: `${methodOptions.name}/fail`,
          error: true,
          payload: err,
        });

        throw new Error(err);
      }
    };
  };

  return newMethodOptions;
};

export const graphqlResolverCreator = function(methodOptions) {
  const newMethodOptions = methodOptions;

  newMethodOptions.graphqlResolver = async function(args) {
    return args;
  };

  return newMethodOptions;
};

export class ValidatedActionMethod extends ValidatedMethod {
  constructor(props) {
  const newProps = props;
  newProps.mixins = [CallPromiseMixin, meteorActionCreator];
  super(newProps);
  }
}
