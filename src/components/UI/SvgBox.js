const SvgItemBuilder = {
  use: (attr) => <use {...attr} />,
  rect: (attr) => <rect {...attr} />,
  circle: (attr) => <circle {...attr} />,
  path: (attr) => <path {...attr} />,
  line: (attr) => <line {...attr} />,
  text: (attr) => <text {...attr} />,
  ellipse: (attr) => <ellipse {...attr} />,
  polygon: (attr) => <polygon {...attr} />,
  polyline: (attr) => <polyline {...attr} />,
};

export const buildSvgTag = (item) => {
  const { tag, ...attr } = item;
  return (SvgItemBuilder[tag] && SvgItemBuilder[tag](attr));
};

export const SvgItemListBuilder = (items) => {
  return (
    items
    .filter((item) => SvgItemBuilder.hasOwnProperty(item.tag))
    .map((item) => {
      // const { tag, ...attr } = item;
      // return SvgItemBuilder[tag](attr);
      return buildSvgTag(item);
    })
  );
};

export const SvgGroup = (props) => {
  return (
    <g {...props} >
      {props.children}
    </g>
  )
};

const SvgBox = (props) => {
  const { viewBox } = props;
  const svgItems = props.items && SvgItemListBuilder(props.items);

  return (
    <svg
      className={props.className}
      xmlns='http://www.w3.org/2000/svg'
      viewBox={viewBox}
      fill='currentColor'
    >
      {props.children}
      {svgItems}
    </svg>
  );
};

export default SvgBox;
