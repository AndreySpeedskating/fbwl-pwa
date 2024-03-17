import { FC, SVGProps } from 'react';

import { ion_text_primary_black } from '../../theme/variables';

const Settings: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.width || ''}
    height={props?.height || ''}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill={props?.fill || ion_text_primary_black}
      d="m19.98 8.72-.36.65.36-.65Zm.37.2.36-.65-.36.65Zm1.64 2.8.75-.01H22Zm0 .55h-.74.75Zm-1.64 2.81.36.66-.36-.66Zm-.36.2-.37-.66.37.66Zm-1.16 2 .75-.02-.75.01Zm.01.42-.75.01.75-.01Zm-1.6 2.82.38.65-.37-.65Zm-.48.28-.38-.65.38.65Zm-3.25-.02-.39.64.39-.64Zm-.36-.22.39-.64-.39.64Zm-2.3 0-.39-.64.39.64Zm-.35.21.38.65-.38-.65Zm-3.25.03-.37.65.37-.65Zm-.49-.28.37-.65-.37.65Zm-1.6-2.83.75.01-.75-.01Zm0-.4-.74-.02.75.01Zm-1.15-2.01-.37.65.37-.65Zm-.36-.2.36-.66-.36.66Zm-1.64-2.8h.75H2Zm0-.55h-.76H2Zm1.64-2.81-.36-.66.36.66Zm.36-.2.37.65L4 8.72Zm1.16-2-.75.02.75-.01Zm-.01-.42.75-.01-.75.01Zm1.6-2.82-.39-.65.38.65Zm.48-.28.38.65-.38-.65Zm3.25.02.39-.64-.39.64Zm.36.22-.39.64.39-.64Zm2.3 0-.38-.65.38.65Zm.35-.21.39.64-.39-.64Zm3.25-.03-.38.65.38-.65Zm.49.28.37-.65-.37.65Zm1.6 2.83-.75-.01h.75Zm0 .42h.74-.75Zm0 .13.74-.02-.75.02Zm.3 1.02.64-.37-.65.37Zm-.07-.11-.66.35.66-.35Zm-.72-3.53.56-.5-.56.5Zm.41.73.72-.22-.72.22ZM14.7 2.63l.16.73-.16-.73Zm.84 0-.15.73.15-.74Zm-3.41 1.12L12.11 3l.02.75Zm.9-.25.37.66-.36-.66Zm-2.07 0-.36.66.36-.66Zm.91.25L11.9 3l-.02.75ZM8.45 2.61l.15.74-.15-.74Zm.84.01-.16.73.16-.73ZM5.24 4.97l.71.22-.71-.22Zm.41-.73-.56-.5.56.5Zm-.78 3.64.65.38-.65-.38Zm.06-.1-.66-.36.66.35Zm.24-.92h.75-.75Zm-1.04 1.8L3.74 8l.39.65Zm.67-.67-.64-.4.64.4Zm-2.7 2.4.72.23-.72-.23Zm.43-.73.55.5-.55-.5Zm0 4.68-.54.51.55-.5Zm-.42-.72-.71.23.7-.23Zm2.76 2.5.65-.37-.65.38Zm-.07-.11-.64.39.64-.4Zm-.67-.67-.39.65.39-.65Zm1.04 1.8-.75.02.75-.01Zm-.23-.9.66-.34-.66.35Zm.71 3.52-.56.5.56-.5Zm-.41-.73.71-.23-.71.23Zm4.06 2.34.17.73-.17-.73Zm-.84 0-.15.74.15-.73Zm3.4-1.12-.01-.75.02.75Zm-.9.25.37.65-.37-.65Zm2.08 0 .36-.66-.36.66Zm-.91-.25.02-.75-.02.75Zm3.42 1.14.16.73-.16-.73Zm-.84-.01.16-.73-.16.73Zm4.05-2.35.72.22-.72-.22Zm-.41.73.56.5-.56-.5Zm.78-3.64-.65-.38.65.38Zm-.06.1-.66-.35.66.36Zm-.24.92h-.75.75Zm1.04-1.8.39.65-.39-.65Zm-.67.67.64.4-.64-.4Zm2.7-2.4.7.24-.7-.24Zm-.43.73-.55-.5.55.5Zm0-4.68.54-.51-.55.5Zm.42.72-.71.24.71-.24Zm-2.02-1.72.39-.65-.39.65Zm-.67-.67-.64.4.64-.4ZM12 15.25A3.25 3.25 0 0 1 8.75 12h-1.5A4.75 4.75 0 0 0 12 16.75v-1.5ZM8.75 12c0-1.8 1.46-3.25 3.25-3.25v-1.5A4.75 4.75 0 0 0 7.25 12h1.5ZM12 8.75c1.8 0 3.25 1.46 3.25 3.25h1.5A4.75 4.75 0 0 0 12 7.25v1.5ZM15.25 12c0 1.8-1.46 3.25-3.25 3.25v1.5A4.75 4.75 0 0 0 16.75 12h-1.5Zm4.37-2.63.37.2.72-1.3-.36-.2-.73 1.3Zm1.62 2.34v.57h1.5v-.57h-1.5Zm-1.26 2.71-.36.2.73 1.32.36-.2-.73-1.32Zm-1.9 2.87.01.42 1.5-.03v-.42l-1.5.03Zm-1.2 2.58-.5.28.76 1.3.48-.28-.75-1.3Zm-2.99.26-.35-.2-.77 1.28.35.21.77-1.29Zm-3.43-.21-.35.21.77 1.29.35-.21-.77-1.3Zm-2.83.23-.5-.28-.74 1.3.49.28.75-1.3ZM5.9 17.7v-.4l-1.5-.03v.4l1.5.03Zm-1.54-3.08-.36-.2-.72 1.31.35.2.73-1.3Zm-1.6-2.32v-.57h-1.5v.57h1.5Zm1.26-2.71.36-.2-.73-1.32-.36.2.73 1.32Zm1.9-2.87L5.9 6.3l-1.5.03v.42l1.5-.03Zm1.2-2.58.5-.28-.76-1.3-.49.28.76 1.3Zm2.99-.26.35.2.77-1.28-.35-.21-.77 1.29Zm3.43.21.35-.21-.77-1.29-.35.21.77 1.3Zm2.83-.23.5.28.74-1.3-.49-.28-.75 1.3ZM18.1 6.3v.41l1.5.03v-.42l-1.5-.02Zm0 .41v.16l1.5-.03v-.1l-1.5-.03Zm1.7.8a3.56 3.56 0 0 1-.06-.1l-1.32.71.07.14 1.3-.75Zm-1.7-.64c0 .44.11.87.32 1.25l1.32-.7c-.1-.18-.14-.38-.15-.58l-1.5.03Zm-1.23-2.74c.64.37.81.48.93.6l1.12-1c-.32-.34-.75-.58-1.3-.9l-.75 1.3Zm2.73 2.2c.01-.64.03-1.13-.11-1.58l-1.43.45c.05.16.05.36.04 1.1l1.5.02Zm-1.8-1.6c.11.14.2.3.26.47l1.43-.45a2.75 2.75 0 0 0-.57-1.01l-1.12 1Zm-3.9-.86c.63-.38.8-.47.97-.51l-.33-1.46c-.46.1-.87.36-1.41.68l.77 1.29Zm3.23-1.32c-.55-.32-.97-.57-1.43-.66l-.3 1.47c.17.03.34.12.98.49l.75-1.3Zm-2.26.81c.18-.04.36-.04.53 0l.3-1.47a2.75 2.75 0 0 0-1.16 0l.33 1.47ZM12 4.51h.15L12.11 3H12v1.5Zm.77-1.72-.1.06.73 1.3.14-.07-.77-1.29Zm-.62 1.71c.44-.01.87-.13 1.25-.34l-.73-1.31c-.17.1-.36.15-.56.15l.04 1.5Zm-1.69-.42.14.08.73-1.31-.1-.06-.77 1.29ZM12 3h-.1l-.05 1.5H12V3Zm-1.4 1.15c.38.21.8.33 1.25.34l.04-1.5c-.2 0-.39-.06-.56-.15l-.73 1.3Zm-2.98-.31c.63-.37.81-.47.98-.5l-.3-1.47c-.47.1-.89.35-1.44.67l.76 1.3Zm3.26-1.27c-.55-.33-.96-.59-1.42-.7l-.33 1.47c.17.04.34.13.98.52l.77-1.3Zm-2.28.77c.18-.04.36-.04.53 0l.33-1.46a2.75 2.75 0 0 0-1.17-.01l.31 1.47ZM5.9 6.29c0-.73 0-.93.05-1.1l-1.43-.44c-.14.45-.12.93-.11 1.57l1.5-.03Zm.47-3.46c-.54.32-.97.56-1.28.9l1.12 1c.12-.12.28-.23.92-.6l-.76-1.3ZM5.95 5.2c.06-.17.14-.32.26-.46l-1.12-1c-.26.3-.45.64-.57 1.02l1.43.44Zm-.43 3.07.07-.13-1.32-.71-.05.09 1.3.75Zm-1.1-1.52v.1l1.5.03V6.7l-1.5.03Zm1.17 1.39c.2-.4.32-.82.33-1.26l-1.5-.03c0 .2-.06.4-.15.58l1.32.7ZM4.38 9.37l.13-.07-.77-1.29-.09.05.73 1.31Zm-.16-1.86-.06.09 1.28.79.08-.13-1.3-.75ZM4.5 9.3c.38-.23.7-.54.93-.91l-1.28-.8c-.1.18-.25.32-.42.42L4.5 9.3Zm-1.76 2.42c0-.74.01-.93.07-1.1l-1.43-.47c-.15.45-.14.94-.14 1.58h1.5Zm.54-3.46c-.56.31-.99.54-1.3.89l1.1 1.01c.11-.12.28-.23.93-.58l-.73-1.32Zm-.47 2.36c.05-.17.14-.32.26-.46l-1.1-1.01c-.27.29-.47.63-.59 1l1.43.47Zm1.2 3.8a3.97 3.97 0 0 1-.93-.59l-1.1 1.02c.31.35.74.58 1.3.88l.72-1.3ZM1.25 12.3c0 .63-.01 1.12.14 1.56l1.42-.47a3.97 3.97 0 0 1-.06-1.1h-1.5Zm1.83 1.54a1.25 1.25 0 0 1-.27-.45l-1.42.47c.12.37.32.71.59 1l1.1-1.02Zm2.43 1.92-.08-.14-1.28.79.06.1 1.3-.75Zm-1.88.18.1.06.78-1.29-.15-.08-.73 1.31Zm1.8-.32a2.75 2.75 0 0 0-.92-.9L3.73 16c.17.1.32.24.42.41l1.28-.79Zm.48 1.69v-.17l-1.5.03v.11l1.5.03Zm-1.7-.8.05.1 1.33-.7-.08-.15-1.3.75Zm1.7.63a2.78 2.78 0 0 0-.32-1.23l-1.33.7c.1.17.14.36.15.56l1.5-.03Zm1.21 2.74c-.63-.37-.8-.48-.92-.6l-1.12 1c.32.34.75.58 1.3.9l.74-1.3Zm-2.72-2.2c-.01.64-.03 1.13.11 1.58l1.43-.45a3.97 3.97 0 0 1-.04-1.1l-1.5-.02Zm1.8 1.6c-.11-.14-.2-.3-.26-.47l-1.43.45c.12.38.31.72.57 1.01l1.12-1Zm3.9.86c-.63.38-.8.47-.97.51l.33 1.46c.46-.1.87-.36 1.41-.68l-.77-1.29Zm-3.23 1.32c.55.32.97.57 1.43.66l.3-1.47a3.97 3.97 0 0 1-.98-.49l-.75 1.3Zm2.26-.81c-.18.04-.36.04-.53 0l-.3 1.47c.38.08.77.08 1.16 0l-.33-1.47ZM12 19.49h-.15l.04 1.5h.1v-1.5Zm-.77 1.72.1-.06-.73-1.3a4.8 4.8 0 0 0-.14.07l.77 1.29Zm.62-1.71c-.44.01-.87.13-1.25.34l.73 1.31c.17-.1.36-.15.56-.15l-.04-1.5Zm1.69.42a4.8 4.8 0 0 0-.14-.08l-.73 1.31.1.06.77-1.29ZM12 21h.1l.05-1.5H12V21Zm1.4-1.15a2.75 2.75 0 0 0-1.25-.34l-.04 1.5c.2 0 .39.06.56.15l.73-1.3Zm2.98.31c-.63.37-.81.47-.98.5l.3 1.47c.47-.1.89-.35 1.44-.67l-.76-1.3Zm-3.26 1.27c.55.33.96.59 1.42.7l.33-1.47a3.97 3.97 0 0 1-.98-.52l-.77 1.3Zm2.28-.77c-.18.04-.36.04-.53 0l-.33 1.46c.38.09.78.09 1.17 0l-.31-1.46Zm2.7-2.94c0 .73 0 .93-.05 1.1l1.43.44c.14-.45.12-.93.11-1.57l-1.5.03Zm-.48 3.46c.55-.32.98-.56 1.29-.9l-1.12-1c-.12.12-.28.23-.92.6l.75 1.3Zm.43-2.36a1.4 1.4 0 0 1-.26.46l1.12 1c.26-.3.45-.64.57-1.02l-1.43-.44Zm.43-3.07-.07.13 1.32.71.05-.09-1.3-.75Zm1.1 1.52v-.1l-1.5-.03v.16l1.5-.03Zm-1.17-1.39c-.2.4-.32.82-.33 1.26l1.5.03c0-.2.06-.4.15-.58l-1.32-.7Zm1.21-1.25-.13.08.77 1.29.09-.05-.73-1.32Zm.16 1.87.06-.09-1.28-.79-.08.13 1.3.75Zm-.3-1.79c-.37.23-.69.54-.92.91l1.28.8c.1-.18.25-.32.42-.42l-.77-1.29Zm1.77-2.42c0 .73-.01.93-.07 1.1l1.43.47c.15-.45.14-.94.14-1.58h-1.5Zm-.54 3.46c.56-.31.99-.54 1.3-.89l-1.1-1.02a3.5 3.5 0 0 1-.93.6l.73 1.3Zm.47-2.36c-.05.17-.14.32-.26.45l1.1 1.02c.27-.29.47-.63.59-1l-1.43-.47Zm-1.2-3.8c.65.36.82.46.93.59l1.1-1.02c-.31-.35-.74-.58-1.3-.88L20 9.57Zm2.76 2.13c0-.63.01-1.12-.14-1.56l-1.42.47c.05.16.06.36.06 1.1l1.5-.01Zm-1.83-1.54c.12.13.21.28.27.45l1.42-.47a2.75 2.75 0 0 0-.59-1l-1.1 1.02Zm-.56-2.1a3.63 3.63 0 0 1-.1-.06L19.5 9.3l.13.07.73-1.3Zm-1.87.19.08.13 1.28-.8a3.27 3.27 0 0 1-.06-.08l-1.3.75ZM20.26 8c-.17-.1-.32-.24-.42-.41l-1.28.8c.23.36.55.67.93.9L20.26 8Z"
    />
  </svg>
);

export default Settings;