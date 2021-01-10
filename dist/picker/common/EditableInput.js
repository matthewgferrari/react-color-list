function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, PureComponent } from 'react';
import reactCSS from 'reactcss';
import Typography from "@material-ui/core/Typography";
const DEFAULT_ARROW_OFFSET = 1;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];

const isValidKeyCode = keyCode => VALID_KEY_CODES.indexOf(keyCode) > -1;

const getNumberValue = value => Number(String(value).replace(/%/g, ''));

let idCounter = 1;
export class EditableInput extends (PureComponent || Component) {
  constructor(props) {
    super();

    _defineProperty(this, "handleBlur", () => {
      if (this.state.blurValue) {
        this.setState({
          value: this.state.blurValue,
          blurValue: null
        });
      }
    });

    _defineProperty(this, "handleChange", e => {
      this.setUpdatedValue(e.target.value, e);
    });

    _defineProperty(this, "handleKeyDown", e => {
      // In case `e.target.value` is a percentage remove the `%` character
      // and update accordingly with a percentage
      // https://github.com/casesandberg/react-color/issues/383
      const value = getNumberValue(e.target.value);

      if (!isNaN(value) && isValidKeyCode(e.keyCode)) {
        const offset = this.getArrowOffset();
        const updatedValue = e.keyCode === UP_KEY_CODE ? value + offset : value - offset;
        this.setUpdatedValue(updatedValue, e);
      }
    });

    _defineProperty(this, "handleDrag", e => {
      if (this.props.dragLabel) {
        const newValue = Math.round(this.props.value + e.movementX);

        if (newValue >= 0 && newValue <= this.props.dragMax) {
          this.props.onChange && this.props.onChange(this.getValueObjectWithLabel(newValue), e);
        }
      }
    });

    _defineProperty(this, "handleMouseDown", e => {
      if (this.props.dragLabel) {
        e.preventDefault();
        this.handleDrag(e);
        window.addEventListener('mousemove', this.handleDrag);
        window.addEventListener('mouseup', this.handleMouseUp);
      }
    });

    _defineProperty(this, "handleMouseUp", () => {
      this.unbindEventListeners();
    });

    _defineProperty(this, "unbindEventListeners", () => {
      window.removeEventListener('mousemove', this.handleDrag);
      window.removeEventListener('mouseup', this.handleMouseUp);
    });

    this.state = {
      value: String(props.value).toUpperCase(),
      blurValue: String(props.value).toUpperCase()
    };
    this.inputId = `rc-editable-input-${idCounter++}`;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== this.state.value && (prevProps.value !== this.props.value || prevState.value !== this.state.value)) {
      if (this.input === document.activeElement) {
        this.setState({
          blurValue: String(this.props.value).toUpperCase()
        });
      } else {
        this.setState({
          value: String(this.props.value).toUpperCase(),
          blurValue: !this.state.blurValue && String(this.props.value).toUpperCase()
        });
      }
    }
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  getValueObjectWithLabel(value) {
    return {
      [this.props.label]: value
    };
  }

  getArrowOffset() {
    return this.props.arrowOffset || DEFAULT_ARROW_OFFSET;
  }

  setUpdatedValue(value, e) {
    const onChangeValue = this.props.label ? this.getValueObjectWithLabel(value) : value;
    this.props.onChange && this.props.onChange(onChangeValue, e);
    this.setState({
      value
    });
  }

  render() {
    const styles = reactCSS({
      'default': {
        wrap: {
          position: 'relative'
        }
      },
      'user-override': {
        wrap: this.props.style && this.props.style.wrap ? this.props.style.wrap : {},
        input: this.props.style && this.props.style.input ? this.props.style.input : {},
        label: this.props.style && this.props.style.label ? this.props.style.label : {}
      },
      'dragLabel-true': {
        label: {
          cursor: 'ew-resize'
        }
      }
    }, {
      'user-override': true
    }, this.props);
    return /*#__PURE__*/React.createElement("div", {
      style: styles.wrap
    }, /*#__PURE__*/React.createElement("input", {
      className: "colorPickerInput",
      id: this.inputId,
      style: styles.input,
      ref: input => this.input = input,
      value: this.state.value,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      placeholder: this.props.placeholder,
      spellCheck: "false"
    }), this.props.label && !this.props.hideLabel ? /*#__PURE__*/React.createElement("label", {
      htmlFor: this.inputId,
      style: styles.label,
      onMouseDown: this.handleMouseDown
    }, /*#__PURE__*/React.createElement(Typography, {
      variant: "subtitle2",
      component: "span"
    }, this.props.label)) : null);
  }

}
export default EditableInput;