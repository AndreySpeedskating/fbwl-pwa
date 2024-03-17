import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Reader: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props?.width || '40'}
    height={props?.height || '40'}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 29.5C14.4091 26.5209 9.37879 28.2587 7.5 29.5V12.5562C12.7364 8.83225 17.6818 11.0045 19.5 12.5562M19.5 29.5V12.5562M19.5 29.5C21.3788 28.2587 26.4091 26.5209 31.5 29.5V12.5562C29.6818 11.0045 24.7364 8.83225 19.5 12.5562"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
  </svg>
);

export default Reader;
