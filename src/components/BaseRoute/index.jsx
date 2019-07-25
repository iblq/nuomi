import PropTypes from 'prop-types';
import BaseNuomi from '../BaseNuomi';
import { listener, matchPath } from '../../core/router';

class BaseRoute extends BaseNuomi {
  static propTypes = {
    id: PropTypes.string,
    wrapper: PropTypes.bool,
    reload: PropTypes.bool,
    state: PropTypes.object,
    data: PropTypes.object,
    store: PropTypes.object,
    reducers: PropTypes.object,
    effects: PropTypes.func,
    render: PropTypes.func,
    onBefore: PropTypes.func,
    onInit: PropTypes.func,
    onChange: PropTypes.func,
    onLeave: PropTypes.func,
  };

  constructor(...args) {
    super(...args);
    const { store, path, reload } = this.props;
    if (!store.id) {
      this.createStore();
      this.createReducer();
    } else if (reload === true) {
      this.checkReload(this.props);
    }
    this.unListener = listener((location) => {
      const { props } = this;
      if (props.onChange && matchPath(location, path)) {
        props.onChange();
      }
    });
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkReload(nextProps);
  }

  componentWillUnmount() {
    this.unListener();
  }

  checkReload(nextProps) {
    const { store, state } = this.props;
    if (store.id && nextProps.reload === true) {
      store.dispatch({
        type: 'setState',
        payload: state,
      });
      this.initialize();
    }
  }

  initialize() {
    const { props } = this;
    const { routerLocationCallback } = props;
    if (routerLocationCallback) {
      routerLocationCallback(props);
    }
    if (props.onInit) {
      props.onInit();
    }
  }
}

export default BaseRoute;
