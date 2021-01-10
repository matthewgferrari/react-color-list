function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, PureComponent } from 'react';
import reactCSS from 'reactcss';
import * as hue from '../helpers/hue';
export class Hue extends (PureComponent || Component) {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleChange", e => {
      const change = hue.calculateChange(e, this.props.direction, this.props.hsl, this.container);
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
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleChange);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const {
      direction = 'horizontal'
    } = this.props;
    const styles = reactCSS({
      'default': {
        hue: {
          absolute: '0px 0px 0px 0px',
          borderRadius: this.props.radius,
          boxShadow: this.props.shadow
        },
        container: {
          padding: '0 2px',
          position: 'relative',
          height: '100%',
          borderRadius: this.props.radius
        },
        pointer: {
          position: 'absolute',
          left: `${this.props.hsl.h * 100 / 360}%`
        },
        slider: {
          marginTop: '1px',
          width: '4px',
          borderRadius: '1px',
          height: '8px',
          boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
          background: '#fff',
          transform: 'translateX(-2px)'
        }
      },
      'vertical': {
        pointer: {
          left: '0px',
          top: `${-(this.props.hsl.h * 100 / 360) + 100}%`
        }
      }
    }, {
      vertical: direction === 'vertical'
    });
    return /*#__PURE__*/React.createElement("div", {
      style: styles.hue
    }, /*#__PURE__*/React.createElement("div", {
      className: `hue-${direction}`,
      style: styles.container,
      ref: container => this.container = container,
      onMouseDown: this.handleMouseDown,
      onTouchMove: this.handleChange,
      onTouchStart: this.handleChange
    }, /*#__PURE__*/React.createElement("style", null, `
            .hue-horizontal {
              background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0
                33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to right, #f00 0%, #ff0
                17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }

            .hue-vertical {
              background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,
                #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,
                #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }
          `), /*#__PURE__*/React.createElement("div", {
      style: styles.pointer
    }, this.props.pointer ? /*#__PURE__*/React.createElement(this.props.pointer, this.props) : /*#__PURE__*/React.createElement("div", {
      style: styles.slider
    }))));
  }

}
export default Hue;