import React from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss';
import merge from 'lodash/merge';
import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from './common';
import ChromeFields from './ChromeFields';
import ChromePointer from './ChromePointer';
import ChromePointerCircle from './ChromePointerCircle';
export const Chrome = ({
  width,
  onChange,
  disableAlpha,
  rgb,
  hsl,
  hsv,
  hex,
  renderers,
  styles: passedStyles = {},
  className = '',
  defaultView
}) => {
  const styles = reactCSS(merge({
    'default': {
      picker: {
        width,
        background: 'transparent',
        borderRadius: '2px',
        // boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
        boxSizing: 'initial',
        fontFamily: 'Menlo'
      },
      saturation: {
        width: 'calc(100% - 12px)',
        paddingBottom: 'calc(55% - 6px)',
        marginTop: "6px",
        marginLeft: "6px",
        position: 'relative',
        borderRadius: '2px 2px 0 0',
        overflow: 'hidden'
      },
      Saturation: {
        radius: '2px 2px 0 0'
      },
      body: {
        padding: '16px 16px 12px'
      },
      controls: {
        display: 'flex'
      },
      color: {
        width: '32px'
      },
      swatch: {
        marginTop: '6px',
        width: '16px',
        height: '16px',
        borderRadius: '8px',
        position: 'relative' //  overflow: 'hidden',

      },
      active: {
        absolute: '0px 0px 0px 0px',
        borderRadius: '8px',
        transform: "scale(2, 2) translateX(-2px)",
        boxShadow: 'inset 0 0 0 0px rgba(0,0,0,.1)',
        background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
        zIndex: '2'
      },
      toggles: {
        flex: '1'
      },
      hue: {
        height: '10px',
        position: 'relative',
        marginBottom: '8px'
      },
      Hue: {
        radius: '2px'
      },
      alpha: {
        height: '10px',
        position: 'relative'
      },
      Alpha: {
        radius: '2px'
      }
    },
    'disableAlpha': {
      color: {
        width: '22px'
      },
      alpha: {
        display: 'none'
      },
      hue: {
        marginBottom: '0px'
      },
      swatch: {
        width: '10px',
        height: '10px',
        marginTop: '0px'
      }
    }
  }, passedStyles), {
    disableAlpha
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "pickerContainer",
    style: styles.picker,
    className: `chrome-picker ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.saturation
  }, /*#__PURE__*/React.createElement(Saturation, {
    style: styles.Saturation,
    hsl: hsl,
    hsv: hsv,
    pointer: ChromePointerCircle,
    onChange: onChange
  })), /*#__PURE__*/React.createElement("div", {
    style: styles.body
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.controls,
    className: "flexbox-fix"
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.color
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.swatch
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.active
  }), /*#__PURE__*/React.createElement(Checkboard, {
    renderers: renderers
  }))), /*#__PURE__*/React.createElement("div", {
    style: styles.toggles
  }, /*#__PURE__*/React.createElement("div", {
    style: styles.hue
  }, /*#__PURE__*/React.createElement(Hue, {
    style: styles.Hue,
    hsl: hsl,
    pointer: ChromePointer,
    onChange: onChange
  })), /*#__PURE__*/React.createElement("div", {
    style: styles.alpha
  }, /*#__PURE__*/React.createElement(Alpha, {
    style: styles.Alpha,
    rgb: rgb,
    hsl: hsl,
    pointer: ChromePointer,
    renderers: renderers,
    onChange: onChange
  })))), /*#__PURE__*/React.createElement(ChromeFields, {
    rgb: rgb,
    hsl: hsl,
    hex: hex,
    view: defaultView,
    onChange: onChange,
    disableAlpha: disableAlpha
  })));
};
Chrome.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disableAlpha: PropTypes.bool,
  styles: PropTypes.object,
  defaultView: PropTypes.oneOf(["hex", "rgb", "hsl"])
};
Chrome.defaultProps = {
  width: 225,
  disableAlpha: false,
  styles: {}
};
export default ColorWrap(Chrome);