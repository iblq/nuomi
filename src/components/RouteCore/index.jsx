import React from 'react';
import PropTypes from 'prop-types';
import BaseRoute from '../BaseRoute';
import { isFunction, isObject } from '../../utils';
import extend from '../../utils/extend';
import { getDefaultProps } from '../../core/nuomi';

let wrappers = [];

class RouteCore extends React.PureComponent {
  static propTypes = {
    onBefore: PropTypes.func,
  };

  static contextTypes = {
    routeTempData: PropTypes.object,
  };

  constructor(...args) {
    super(...args);
    this.ref = React.createRef();
    this.wrapperRef = React.createRef();
    this.mounted = false;
    this.wrapper = null;
    const { async, ...rest } = this.props;
    const loaded = !isFunction(async);
    const nuomiProps = extend(getDefaultProps(), rest);
    this.state = {
      // 是否异步加载完，async为函数时为false
      loaded,
      // 是否显示路由组件，异步时为false，因为异步加载的props可能包含onBefore，非异步时，没有onBefore值为true
      visible: loaded ? !nuomiProps.onBefore : false,
      // 异步加载的props
      nuomiProps,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { current } = this.wrapperRef;
    const { loaded, nuomiProps } = this.state;
    if (current) {
      this.wrapper = current;
      wrappers.push(current);
    }
    // 路由加载后，隐藏所有wrapper
    this.hideWrapper();
    if (!loaded) {
      this.loadProps((nextNuomiProps) => {
        // 获取异步加载到的props
        this.visibleHandler(nextNuomiProps, () => {
          this.showWrapper();
          // 合并state
          this.visibleRoute({
            loaded: true,
            nuomiProps: nextNuomiProps,
          });
        });
      });
    } else {
      this.visibleHandler(nuomiProps, () => {
        this.showWrapper();
        this.visibleRoute();
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, wrapper } = this.props;
    const { current } = this.wrapperRef;
    // 清理wrapper
    if (wrapper === false && this.wrapper) {
      this.removeWrapper();
      this.wrapper = null;
    } else if (wrapper === true && !this.wrapper && current) {
      this.wrapper = current;
      wrappers.push(current);
    }
    if (location !== prevProps.location) {
      // 切换当前路由后，隐藏所有wrapper
      this.hideWrapper();
      if (wrapper === true) {
        // 控制当前路由wrapper显示
        const { nuomiProps } = this.state;
        this.visibleHandler(nuomiProps, () => {
          this.showWrapper();
        });
      }
    }
  }

  componentWillUnmount() {
    // 防止组件销毁时更新state报错
    this.mounted = false;
  }

  // 设置data临时数据，保存设置前的数据
  setData(locationData) {
    const { nuomiProps } = this.state;
    const { data } = nuomiProps;
    const { routeTempData } = this.context;
    const keys = Object.keys(locationData);
    if (keys.length) {
      const dataKeys = Object.keys(data);
      // 存储临时数据
      routeTempData.temp = locationData;
      // 存储之前的data数据，为了临时数据使用完后还原
      routeTempData.prev = {};
      keys.forEach((key) => {
        if (dataKeys.includes(key)) {
          routeTempData.prev[key] = dataKeys[key];
        }
        data[key] = locationData[key];
      });
    }
  }

  restoreData() {
    const { nuomiProps } = this.state;
    const { data } = nuomiProps;
    const { routeTempData } = this.context;
    // 删除临时数据
    if (routeTempData.temp) {
      const tempDataKeys = Object.keys(routeTempData.temp);
      if (tempDataKeys.length) {
        tempDataKeys.forEach((key) => {
          delete data[key];
        });
        routeTempData.temp = null;
      }
    }
    // 还原旧数据
    if (routeTempData.prev) {
      const prevDataKeys = Object.keys(routeTempData.prev);
      if (prevDataKeys.length) {
        prevDataKeys.forEach((key) => {
          data[key] = this.oldData[key];
        });
        routeTempData.prev = null;
      }
    }
  }

  // 异步加载props，可以使用require.ensure或import
  loadProps(cb) {
    const { async } = this.props;
    const { nuomiProps } = this.state;
    /**
     * async: ((cb) => {
     *  require.ensure([], (require) => {
     *    cb(require(path).default);
     *  })
     * })
     */
    const loadResult = async((props) => {
      cb(extend(nuomiProps, props));
    });
    /**
     * async: () => import(path);
     */
    if (loadResult && loadResult instanceof Promise) {
      loadResult.then((module) => cb(extend(nuomiProps, module.default)));
    }
  }

  // 根据onBefore决定是否可以展示组件
  // eslint-disable-next-line class-methods-use-this
  visibleHandler(nuomiProps, cb) {
    if (nuomiProps.onBefore) {
      if (
        nuomiProps.onBefore(() => {
          cb();
        }) === true
      ) {
        cb();
      }
    } else {
      cb();
    }
  }

  visibleRoute(state) {
    const { visible } = this.state;
    if (this.mounted) {
      if (!visible) {
        this.setState({ visible: true, ...state });
      } else if (state) {
        this.setState(state);
      }
    }
  }

  showWrapper() {
    if (this.wrapper) {
      this.wrapper.style.display = 'block';
    }
  }

  // 移出当前wrapper
  removeWrapper() {
    if (this.wrapper) {
      wrappers = wrappers.filter((wrapper) => wrapper !== this.wrapper);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  hideWrapper() {
    wrappers.forEach((wrapper) => {
      // eslint-disable-next-line no-param-reassign
      wrapper.style.display = 'none';
    });
  }

  render() {
    const { location, wrapper } = this.props;
    const { nuomiProps, visible, loaded } = this.state;
    const { data, reload = nuomiProps.reload } = location;
    this.restoreData();
    if (isObject(data)) {
      this.setData(data);
    }
    if (wrapper || (loaded && visible)) {
      const baseRoute = (
        <BaseRoute ref={this.ref} {...nuomiProps} reload={reload} location={location} />
      );
      if (wrapper) {
        return (
          <div ref={this.wrapperRef} className="nuomi-route-wrapper">
            {loaded && visible && baseRoute}
          </div>
        );
      }
      return baseRoute;
    }
    return null;
  }
}

export default RouteCore;
