import { FC, SVGProps } from 'react';

const Burger: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={props?.width || '36'}
    height={props?.height || '36'}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 25.5H28.5M13.5 18H28.5M13.5 10.5H28.5M7.50293 25.5V25.503L7.5 25.503V25.5H7.50293ZM7.50293 18V18.003L7.5 18.003V18H7.50293ZM7.50293 10.5V10.503L7.5 10.503V10.5H7.50293Z"
      stroke="#231B1F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Burger;
