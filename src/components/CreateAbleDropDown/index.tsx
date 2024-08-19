import { StylesConfig } from "react-select";
import CreatableSelect from 'react-select/creatable';



const CustomCreateAbleDropdown = ({
  name = "",
  className = "",
  value = {},
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
      height: "43px",
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

// const value1 = { value: 'chocolate', label: 'Chocolate' }

  let sortedOptions= options.sort(function(a, b) {
    return sortedBy === 'label' ? a?.label?.localeCompare(b?.label) : a?.value?.localeCompare(b?.value) ;
 });

  return (
    <>
      <CreatableSelect
        name={name}
        className={`custom-dropdown ${className}`}
        placeholder={placeholder}
        options={[{ label: placeholder, value: "" }, ...sortedOptions]}
        styles={colourStyles}
        value={value}
        isClearable={isClearable}
        onChange={onChange}
      />
    </>
  );
};

export default CustomCreateAbleDropdown;
