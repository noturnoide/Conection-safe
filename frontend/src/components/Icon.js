// Material Design Icons wrapper. Usage: <Icon name="shield-check" size={5} style={{color:'#1E3A8A'}} />
const SIZE_MAP = {
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
};

export default function Icon({ name, size = 5, spin = false, className = "", style = {}, ...rest }) {
  const cls = `mdi mdi-${name}${spin ? " mdi-spin" : ""}${className ? " " + className : ""}`;
  return (
    <i
      className={cls}
      style={{
        fontSize: SIZE_MAP[size] || "1.25rem",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
}
