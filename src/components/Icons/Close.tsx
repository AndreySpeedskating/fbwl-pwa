import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Close: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    width={props?.width || '24'}
    height={props?.height || '24'}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.3137 6L6 18"
      stroke={props.fill || ion_text_primary_black}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 18L6 6"
      stroke={props.fill || ion_text_primary_black}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default Close;
