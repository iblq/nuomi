import React from 'react';
import PropTypes from 'prop-types';
import NuomiRoute from '../NuomiRoute';
import RouterContext from '../RouterContext';
import { removeReducer } from '../../core/redux/reducer';
import { matchPath, savePath, removePath } from '../../core/router';

class Route extends React.PureComponent {
  static defaultProps = {
    path: '/',
    wrapper: false,
  };

  static propTypes = {
    path: PropTypes.string,
    wrapper: PropTypes.bool,
  };

  static wrappers = [];

  constructor(...args) {
    super(...args);
    this.store = {};
    this.routeComponent = null;
    this.ref = React.createRef();
    this.repeated = true;
    const { path } = this.props;
    if (savePath(path)) {
      this.repeated = false;
    }
  }

  componentWillUnmount() {
    const { allow } = this.state;
    const { path, wrapper } = this.props;
    const { current } = this.ref;
    const { id } = this.store;
    if (wrapper && current) {
      current.removeWrapper();
    }
    if (allow) {
      removePath(path);
    }
    if (id) {
      removeReducer(id);
    }
  }

  render() {
    const { path, wrapper } = this.props;
    // 重复的path将不被渲染
    if (this.repeated) {
      return null;
    }
    return (
      <RouterContext.Consumer>
        {({ location }) => {
          const match = matchPath(location, path);
          if (!location.reload && wrapper && this.routeComponent) {
            if (match) {
              this.ref.current.visibleWrapperHandler();
            }
            return this.routeComponent;
          }
          if (match) {
            this.routeComponent = (
              <RouterContext.Provider value={{ location }}>
                <NuomiRoute {...this.props} store={this.store} ref={this.ref} />
              </RouterContext.Provider>
            );
            return this.routeComponent;
          }
          return null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
