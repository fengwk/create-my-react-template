export function bindActions(dispatch, actions) {
  const bindedActions = {};
  for (const key of Object.keys(actions)) {
    bindedActions[key] = (...args) => dispatch(actions[key](...args));
  }
  return bindedActions;
}
