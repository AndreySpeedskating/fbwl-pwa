/* eslint-disable sonarjs/prefer-immediate-return */
import videoLogo from '../../../../assets/image/video-logo.png';
import { ONE } from '../../../../utils/constants';

export const convertDate = (date?: string | null): string => {
  if (!date) {
    return '- не выбрана';
  }
  const dateChunks = date?.split('T');
  const dateStr = dateChunks?.[0]?.split('-')?.reverse()?.join('.');
  const time = dateChunks?.[ONE]?.split(':');
  return `- ${dateStr} в ${time[0]}:${time[ONE]}`;
};

export const readUploadedFileAsText = async (
  inputFile: File,
  i: number
): Promise<{ startIndex: number; url: any, name?: string, type?: string }> => {
  const temporaryFileReader = new FileReader();

  const data = await new Promise((_resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    temporaryFileReader.onloadend = (e) => _resolve({ url: e?.target?.result, startIndex: i });
    if (inputFile?.type?.includes('video')) {
      _resolve({ url: videoLogo, startIndex: i, type: inputFile.type, name: inputFile.name });
      return;
    }
    temporaryFileReader.readAsDataURL(inputFile);
  }).then((response: any) => response);
  return data;
};
