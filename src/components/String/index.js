import React from "react";
import { Input } from "antd";
import PropTypes from "prop-types";

const String = ({ type = "text", disabled = false, placeholder="" } = { type: "text", disabled: false, placeholder: "" }) => (
  <Input
    type={type}
    disabled={disabled}
    placeholder={placeholder}
  />
);

String.propTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

String.defaultProps = {
  type: 'text',
  disabled: false,
  placeholder: ""
};

export default String
