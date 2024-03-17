import { FC, SVGProps } from 'react';

import { ion_input_error } from '../../theme/variables';

const Warning: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.91927 8.13341L2.35228 8.38341L1.91927 8.13341ZM5.15243 2.53341L4.71942 2.28341L5.15243 2.53341ZM8.84766 2.53341L9.28067 2.28341L8.84766 2.53341ZM12.0808 8.13341L12.5138 7.88341L12.0808 8.13341ZM6.45755 0.781944L6.66092 1.23872L6.45755 0.781944ZM7.54232 0.781944L7.33895 1.23872L7.54232 0.781944ZM1.59766 11.0787L1.30376 11.4832L1.59766 11.0787ZM1.05521 10.1394L1.55247 10.0871L1.05521 10.1394ZM12.4024 11.0787L12.6963 11.4832L12.4024 11.0787ZM12.9449 10.1394L13.4421 10.1916L12.9449 10.1394ZM7.0332 8.66671H7.5332C7.5332 8.39057 7.30935 8.16671 7.0332 8.16671V8.66671ZM7.0332 8.73338L7.03308 9.23338C7.16571 9.23341 7.29292 9.18075 7.38671 9.08697C7.48051 8.9932 7.5332 8.86601 7.5332 8.73338H7.0332ZM6.9668 8.73336H6.4668C6.4668 9.00945 6.69058 9.23329 6.96667 9.23336L6.9668 8.73336ZM6.9668 8.66671V8.16671C6.69066 8.16671 6.4668 8.39057 6.4668 8.66671H6.9668ZM7.5 4.00004C7.5 3.7239 7.27614 3.50004 7 3.50004C6.72386 3.50004 6.5 3.7239 6.5 4.00004H7.5ZM6.5 6.66671C6.5 6.94285 6.72386 7.16671 7 7.16671C7.27614 7.16671 7.5 6.94285 7.5 6.66671H6.5ZM10.2332 10.8334H3.76693V11.8334H10.2332V10.8334ZM2.35228 8.38341L5.58545 2.78341L4.71942 2.28341L1.48626 7.88341L2.35228 8.38341ZM8.41465 2.78341L11.6478 8.38341L12.5138 7.88341L9.28067 2.28341L8.41465 2.78341ZM5.58545 2.78341C5.89353 2.24979 6.10767 1.87984 6.29232 1.61844C6.47848 1.3549 6.5889 1.27078 6.66092 1.23872L6.25418 0.325172C5.93043 0.469315 5.69143 0.735867 5.47555 1.04148C5.25816 1.34922 5.01762 1.7669 4.71942 2.28341L5.58545 2.78341ZM9.28067 2.28341C8.98245 1.76687 8.74186 1.34919 8.52439 1.04143C8.30844 0.735802 8.0694 0.469296 7.74569 0.325172L7.33895 1.23872C7.41101 1.2708 7.52149 1.35497 7.7077 1.61849C7.89239 1.87988 8.10658 2.24983 8.41465 2.78341L9.28067 2.28341ZM6.66092 1.23872C6.87667 1.14266 7.1232 1.14266 7.33895 1.23872L7.74569 0.325172C7.27103 0.113838 6.72885 0.113838 6.25418 0.325172L6.66092 1.23872ZM3.76693 10.8334C3.15078 10.8334 2.72335 10.8329 2.40469 10.8036C2.08343 10.7742 1.95536 10.7206 1.89155 10.6742L1.30376 11.4832C1.59044 11.6915 1.94071 11.7653 2.31333 11.7995C2.68853 11.8339 3.1705 11.8334 3.76693 11.8334V10.8334ZM1.48626 7.88341C1.18804 8.39994 0.946632 8.81709 0.788851 9.15924C0.632158 9.49904 0.52091 9.83925 0.557948 10.1916L1.55247 10.0871C1.54422 10.0087 1.56186 9.87094 1.69695 9.578C1.83095 9.28741 2.04422 8.917 2.35228 8.38341L1.48626 7.88341ZM1.89155 10.6742C1.7004 10.5354 1.57715 10.3219 1.55247 10.0871L0.557948 10.1916C0.612269 10.7085 0.88349 11.1779 1.30376 11.4832L1.89155 10.6742ZM10.2332 11.8334C10.8297 11.8334 11.3116 11.8339 11.6868 11.7995C12.0594 11.7653 12.4097 11.6915 12.6963 11.4832L12.1085 10.6742C12.0447 10.7206 11.9167 10.7742 11.5954 10.8036C11.2768 10.8329 10.8494 10.8334 10.2332 10.8334V11.8334ZM11.6478 8.38341C11.9559 8.917 12.1691 9.28741 12.3031 9.578C12.4382 9.87094 12.4559 10.0087 12.4476 10.0871L13.4421 10.1916C13.4792 9.83925 13.3679 9.49904 13.2112 9.15924C13.0535 8.81709 12.8121 8.39994 12.5138 7.88341L11.6478 8.38341ZM12.6963 11.4832C13.1166 11.1779 13.3878 10.7085 13.4421 10.1916L12.4476 10.0871C12.4229 10.3219 12.2997 10.5354 12.1085 10.6742L12.6963 11.4832ZM6.5332 8.66671V8.73338H7.5332V8.66671H6.5332ZM7.03333 8.23338L6.96692 8.23336L6.96667 9.23336L7.03308 9.23338L7.03333 8.23338ZM7.4668 8.73336V8.66671H6.4668V8.73336H7.4668ZM6.9668 9.16671H7.0332V8.16671H6.9668V9.16671ZM6.5 4.00004V6.66671H7.5V4.00004H6.5Z"
      fill={props?.fill || ion_input_error}
    />
  </svg>
);

export default Warning;
