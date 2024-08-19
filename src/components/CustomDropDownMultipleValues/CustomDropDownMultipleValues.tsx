import React from "react";
import Select, { StylesConfig } from "react-select";


const CustomDropdownMultipleValues = ({
  name = "",
  className = "",
  value = [],
  options = [] as any[],
  placeholder = "Select",
  onChange = (e) => {},
  isClearable = false,
  sortedBy = 'label'
}) => {


  const colourStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#F5F8FA",
      border: "0",
      outline: "none",
      minHeight: "43px",
      borderRadius: "0.475rem",
      ":hover": {
        borderColor: "transparent",
        boxShadow: "none",
      },
    }),
    input: (styles) => ({
      ...styles,
      outline: "none",
      fontWeight: "500",
      fontSize: "1.1rem",
      color: "#5E6278",
    }),
    placeholder: (styles) => ({
      ...styles,
      fontWeight: "500",
      fontSize: "1.1rem",
      color: "#5E6278",
    }),
    singleValue: (styles) => ({
      ...styles,
      fontWeight: "500",
      fontSize: "1.1rem",
      color: "#5E6278",
    }),
  };
  let sortedOptions= options.sort(function(a, b) {
    return sortedBy === 'label' ? a?.label?.localeCompare(b?.label) : a?.value?.localeCompare(b?.value) ;
 });

  return (
    <>
    {value && value.length > 0 ?  (
        <Select
        name={name}
        className={`custom-dropdown ${className}`}
        placeholder={placeholder}
        options={[...sortedOptions]}
        value={value}
        styles={colourStyles}
        isClearable={isClearable}
        onChange={onChange}
        isMulti={true}
      />
      ) : (
        <Select
        name={name}
        className={`custom-dropdown ${className}`}
        placeholder={placeholder}
        options={[...sortedOptions]}
        value={value}
        styles={colourStyles}
        isClearable={isClearable}
        onChange={onChange}
        isMulti={true}
      />
      )
    }  
    </>
  );
};

export default CustomDropdownMultipleValues;
