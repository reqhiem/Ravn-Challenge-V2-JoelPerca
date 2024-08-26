import { v4 as uuidv4 } from 'uuid';

export function generateFilename(file: Express.Multer.File): string {
  const uniqueSuffix = Date.now() + '-' + uuidv4();
  const nameTab = file.originalname.split('.');
  const subArray = nameTab.slice(0, -1);
  const originalName = subArray.join('');
  const ext = `.${nameTab[nameTab.length - 1]}`;
  return `${originalName}-${uniqueSuffix}${ext}`;
}
