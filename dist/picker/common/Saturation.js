function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, PureComponent } from 'react';
import reactCSS from 'reactcss';
import throttle from 'lodash/throttle';
import * as saturation from '../helpers/saturation';
export class Saturation extends (PureComponent || Component) {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", e => {
      typeof this.props.onChange === 'function' && this.throttle(this.props.onChange, saturation.calculateChange(e, this.props.hsl, this.container), e);
    });

    _defineProperty(this, "handleMouseDown", e => {
      this.handleChange(e);
      const renderWindow = this.getContainerRenderWindow();
      renderWindow.addEventListener('mousemove', this.handleChange);
      renderWindow.addEventListener('mouseup', this.handleMouseUp);
    });

    _defineProperty(this, "handleMouseUp", () => {
      this.unbindEventListeners();
    });

    this.throttle = throttle((fn, data, e) => {
      fn(data, e);
    }, 35);
  }

  componentWillUnmount() {
    this.throttle.cancel();
    this.unbindEventListeners();
  }

  getContainerRenderWindow() {
    const {
      container
    } = this;
    let renderWindow = window;

    while (!renderWindow.document.contains(container) && renderWindow.parent !== renderWindow) {
      renderWindow = renderWindow.parent;
    }

    return renderWindow;
  }

  unbindEventListeners() {
    const renderWindow = this.getContainerRenderWindow();
    renderWindow.removeEventListener('mousemove', this.handleChange);
    renderWindow.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const {
      color,
      white,
      black,
      pointer,
      circle
    } = this.props.style || {};
    const styles = reactCSS({
      'default': {
        color: {
          absolute: '0px 0px 0px 0px',
          background: `hsl(${this.props.hsl.h},100%, 50%)`,
          borderRadius: this.props.radius
        },
        white: {
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius
        },
        black: {
          absolute: '0px 0px 0px 0px',
          boxShadow: this.props.shadow,
          borderRadius: this.props.radius
        },
        pointer: {
          position: 'absolute',
          top: `${-(this.props.hsv.v * 100) + 100}%`,
          left: `${this.props.hsv.s * 100}%`,
          cursor: 'default'
        },
        circle: {
          width: '4px',
          height: '4px',
          boxShadow: `0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,
          borderRadius: '50%',
          cursor: 'hand',
          transform: 'translate(-2px, -2px)'
        }
      },
      'custom': {
        color,
        white,
        black,
        pointer,
        circle
      }
    }, {
      'custom': !!this.props.style
    });
    return /*#__PURE__*/React.createElement("div", {
      style: styles.color,
      ref: container => this.container = container,
      onMouseDown: this.handleMouseDown,
      onTouchMove: this.handleChange,
      onTouchStart: this.handleChange
    }, /*#__PURE__*/React.createElement("style", null, `
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `), /*#__PURE__*/React.createElement("div", {
      style: styles.white,
      className: "saturation-white"
    }, /*#__PURE__*/React.createElement("div", {
      style: styles.black,
      className: "saturation-black"
    }), /*#__PURE__*/React.createElement("div", {
      style: styles.pointer
    }, this.props.pointer ? /*#__PURE__*/React.createElement(this.props.pointer, this.props) : /*#__PURE__*/React.createElement("div", {
      style: styles.circle
    }))));
  }

}
export default Saturation;