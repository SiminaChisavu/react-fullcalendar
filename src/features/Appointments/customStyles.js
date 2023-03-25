// Custom styles for the Select component
const options = [
  { value: 'Ioana', label: 'Ioana' },
  { value: 'Gabi', label: 'Gabi' },
];

const customStyles = {
  control: (base) => ({
    ...base,
    height: 33.6,
    minHeight: 33.6,
    border: '1px solid #ab8e10',
    borderRadius: 3.2,
    marginBottom: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    height: 33.6,
    minHeight: 33.6,
    width: 212.8,
    alignItems: 'left',
    paddingLeft: 4.8,
  }),
  menu: (base) => ({
    ...base,
    marginTop: '0 !important',
    border: '1px solid #ab8e10',
    borderTop: 'none',
    borderRadius: '3.2 !important',
  }),
  option: (base, { isFocused }) => {
    return {
      ...base,
      backgroundColor: isFocused ? '#ab8e10' : '#17241c',
      color: isFocused ? '#17241c' : '#ab8e10',
      fontWeight: isFocused ? 'bold' : 'normal',
      paddingLeft: 4.8,
    };
  },
};

export { options, customStyles };
