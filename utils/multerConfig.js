import multer from 'multer';
import sharp from 'sharp';
import AppError from './AppError.js';

const appError = new AppError();

class MulterConfig {
  constructor(fileType, path, errMsg) {
    this.multerStorage =
      fileType === 'image'
        ? multer.memoryStorage()
        : multer.diskStorage({
            destination: (req, file, cb) => {
              cb(null, this.path);
            },
            filename: (req, file, cb) => {
              //? when the file is a record its mimetype is audio/mpeg-3
              //? so when the second part of its mime type is audio/mpeg-3 we replace it with mp3
              const ext =
                file.mimetype.split('/')[1] === 'mpeg-3'
                  ? 'mpeg'
                  : file.mimetype.split('/')[1];
              const filename = `random-${Math.random()}-timestamp-${Date.now()}.${ext}`;
              cb(null, filename);
            },
          });

    this.fileType = fileType;
    this.path = path;
    this.errMsg = errMsg;
  }

  multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith(this.fileType)) {
      cb(null, true);
    } else {
      cb(appError.addError(this.errMsg, 400), false);
    }
  };

  resizeImage = async (req, res, next) => {
    if (!req.file) return next();
    //? this an average of images sizes 2285604
    let computedQuality = Math.floor((2285604 * 20) / req.file.size);
    computedQuality = computedQuality > 100 ? 100 : computedQuality;

    const filename = `random-${Math.random()}-timestamp-${Date.now()}.jpeg`;
    req.file.filename = filename;
    const path = `${this.path}${filename}`;
    req.file.path = path;

    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: computedQuality })
      .toFile(path);

    next();
  };

  upload = () => {
    return multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter,
    });
  };
}

export default MulterConfig;
