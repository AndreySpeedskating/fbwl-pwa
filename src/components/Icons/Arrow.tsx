import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Arrow: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || ''}
    height={props?.height || ''}
    fill="none"
    viewBox="0 0 9 17"
  >
    <path
      stroke={props?.fill || ion_text_primary_black}
      strokeLinecap="round"
      strokeWidth={props?.strokeWidth || '2'}
      d="m1.07 1.43 6.37 6.36a1 1 0 0 1 0 1.42l-6.37 6.36"
    />
  </svg>
);

export default Arrow;
