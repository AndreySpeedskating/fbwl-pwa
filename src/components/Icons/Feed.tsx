import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Feed: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props?.width || '40'}
    height={props?.height || '40'}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 16.52V11.98C30 10.57 29.36 10 27.77 10H23.73C22.14 10 21.5 10.57 21.5 11.98V16.51C21.5 17.93 22.14 18.49 23.73 18.49H27.77C29.36 18.5 30 17.93 30 16.52Z"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
    <path
      d="M30 27.77V23.73C30 22.14 29.36 21.5 27.77 21.5H23.73C22.14 21.5 21.5 22.14 21.5 23.73V27.77C21.5 29.36 22.14 30 23.73 30H27.77C29.36 30 30 29.36 30 27.77Z"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
    <path
      d="M18.5 16.52V11.98C18.5 10.57 17.86 10 16.27 10H12.23C10.64 10 10 10.57 10 11.98V16.51C10 17.93 10.64 18.49 12.23 18.49H16.27C17.86 18.5 18.5 17.93 18.5 16.52Z"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
    <path
      d="M18.5 27.77V23.73C18.5 22.14 17.86 21.5 16.27 21.5H12.23C10.64 21.5 10 22.14 10 23.73V27.77C10 29.36 10.64 30 12.23 30H16.27C17.86 30 18.5 29.36 18.5 27.77Z"
      stroke={props?.stroke || ion_text_primary_black}
      strokeLinejoin="round"
      fill={props?.fill}
    />
  </svg>
);

export default Feed;
