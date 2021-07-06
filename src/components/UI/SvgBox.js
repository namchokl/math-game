const SvgItemBuilder = {
  rect: (attr) => <rect {...attr} />,
  circle: (attr) => <circle {...attr} />,
  path: (attr) => <path {...attr} />,
  line: (attr) => <line {...attr} />,
  text: (attr) => <text {...attr} />,
  ellipse: (attr) => <ellipse {...attr} />,
  polygon: (attr) => <polygon {...attr} />,
  polyline: (attr) => <polyline {...attr} />,
};

const SvgBox = (props) => {
  const { viewBox } = props;

  const svgItems = props.items
    .filter((item) => SvgItemBuilder.hasOwnProperty(item.tag))
    .map((item) => {
      const { tag, ...attr } = item;
      return SvgItemBuilder[tag](attr);
    });

  return (
    <svg
      className={props.className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox={viewBox}
      fill='currentColor'
    >
      {svgItems}
    </svg>
  );
};

export default SvgBox;
