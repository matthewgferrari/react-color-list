function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, PureComponent } from 'react';
import reactCSS from 'reactcss';
import * as alpha from '../helpers/alpha';
import Checkboard from './Checkboard';
export class Alpha extends (PureComponent || Component) {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleChange", e => {
      const change = alpha.calculateChange(e, this.props.hsl, this.props.direction, this.props.a, this.container);
      change && typeof this.props.onChange === 'function' && this.props.onChange(change, e);
    });

    _defineProperty(this, "handleMouseDown", e => {
      this.handleChange(e);
      window.addEventListener('mousemove', this.handleChange);
      window.addEventListener('mouseup', this.handleMouseUp);
    });

    _defineProperty(this, "handleMouseUp", () => {
      this.unbindEventListeners();
    });

    _defineProperty(this, "unbindEventListeners", () => {
      window.removeEventListener('mousemove', this.handleChange);
      window.removeEventListener('mouseup', this.handleMouseUp);
    });
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  render() {
    const rgb = this.props.rgb;
    const styles = reactCSS({
      'default': {
        alpha: {
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius
        },
        checkboard: {
          absolute: '0px 0px 0px 0px',
          overflow: 'hidden',
          borderRadius: this.props.radius
        },
        gradient: {
          absolute: '0px 0px 0px 0px',
          background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
          boxShadow: this.props.shadow,
          borderRadius: this.props.radius
        },
        container: {
          position: 'relative',
          height: '100%',
          margin: '0 3px'
        },
        pointer: {
          position: 'absolute',
          left: `${rgb.a * 100}%`
        },
        slider: {
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          marginTop: '1px',
          transform: 'translateX(-2px)'
        }
      },
      'vertical': {
        gradient: {
          background: `linear-gradient(to bottom, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,
           rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`
        },
        pointer: {
          left: 0,
          top: `${rgb.a * 100}%`
        }
      },
      'overwrite': { ...this.props.style
      }
    }, {
      vertical: this.props.direction === 'vertical',
      overwrite: true
    });
    return /*#__PURE__*/React.createElement("div", {
      style: styles.alpha
    }, /*#__PURE__*/React.createElement("div", {
      style: styles.checkboard
    }, /*#__PURE__*/React.createElement(Checkboard, {
      renderers: this.props.renderers
    })), /*#__PURE__*/React.createElement("div", {
      style: styles.gradient
    }), /*#__PURE__*/React.createElement("div", {
      style: styles.container,
      ref: container => this.container = container,
      onMouseDown: this.handleMouseDown,
      onTouchMove: this.handleChange,
      onTouchStart: this.handleChange
    }, /*#__PURE__*/React.createElement("div", {
      style: styles.pointer
    }, this.props.pointer ? /*#__PURE__*/React.createElement(this.props.pointer, this.props) : /*#__PURE__*/React.createElement("div", {
      style: styles.slider
    }))));
  }

}
export default Alpha;