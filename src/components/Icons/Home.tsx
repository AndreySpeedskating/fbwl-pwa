import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Home: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props?.width || '40'}
    height={props?.height || '40'}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 19.1977L19.5 8.5L31.5 19.1977V31.5H22.7727V25.0814C22.5 22.9419 16.2273 23.2093 16.2273 25.0814V31.5H7.5V19.1977Z"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
  </svg>
);

export default Home;
