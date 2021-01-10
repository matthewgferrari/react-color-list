function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-invalid-this */
import React from 'react';
export const handleFocus = (Component, Span = 'span') => {
  var _temp;

  return _temp = class Focus extends React.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "state", {
        focus: false
      });

      _defineProperty(this, "handleFocus", () => this.setState({
        focus: true
      }));

      _defineProperty(this, "handleBlur", () => this.setState({
        focus: false
      }));
    }

    render() {
      return /*#__PURE__*/React.createElement(Span, {
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, /*#__PURE__*/React.createElement(Component, _extends({}, this.props, this.state)));
    }

  }, _temp;
};