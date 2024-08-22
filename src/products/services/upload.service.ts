import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  getMulterStorage() {
    return diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + uuidv4();
        const nameTab = file.originalname.split('.');
        const subArray = nameTab.slice(0, -1);
        const originalName = subArray.join('');
        const ext = `.${nameTab[nameTab.length - 1]}`;
        const filename = `${originalName}-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    });
  }
}
