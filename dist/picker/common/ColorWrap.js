function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, PureComponent } from 'react';
import debounce from 'lodash/debounce';
import * as color from '../helpers/color';
export const ColorWrap = Picker => {
  class ColorPicker extends (PureComponent || Component) {
    constructor(props) {
      super();

      _defineProperty(this, "handleChange", (data, event) => {
        const isValidColor = color.simpleCheckForValidColor(data);

        if (isValidColor) {
          const colors = color.toState(data, data.h || this.state.oldHue);
          this.setState(colors);
          this.props.onChangeComplete && this.debounce(this.props.onChangeComplete, colors, event);
          this.props.onChange && this.props.onChange(colors, event);
        }
      });

      _defineProperty(this, "handleSwatchHover", (data, event) => {
        const isValidColor = color.simpleCheckForValidColor(data);

        if (isValidColor) {
          const colors = color.toState(data, data.h || this.state.oldHue);
          this.props.onSwatchHover && this.props.onSwatchHover(colors, event);
        }
      });

      this.state = { ...color.toState(props.color, 0)
      };
      this.debounce = debounce((fn, data, event) => {
        fn(data, event);
      }, 100);
    }

    static getDerivedStateFromProps(nextProps, state) {
      return { ...color.toState(nextProps.color, state.oldHue)
      };
    }

    render() {
      const optionalEvents = {};

      if (this.props.onSwatchHover) {
        optionalEvents.onSwatchHover = this.handleSwatchHover;
      }

      return /*#__PURE__*/React.createElement(Picker, _extends({}, this.props, this.state, {
        onChange: this.handleChange
      }, optionalEvents));
    }

  }

  ColorPicker.propTypes = { ...Picker.propTypes
  };
  ColorPicker.defaultProps = { ...Picker.defaultProps,
    color: {
      h: 250,
      s: 0.50,
      l: 0.20,
      a: 1
    }
  };
  return ColorPicker;
};
export default ColorWrap;