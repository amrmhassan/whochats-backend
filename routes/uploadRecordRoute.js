import express from 'express';
import MulterConfig from '../utils/MulterConfig.js';
import ffmpeg from 'ffmpeg';

const convertToMp3 = (filePath) => {
  try {
    var process = new ffmpeg(filePath);
    process.then(
      function (video) {
        // Callback mode
        video.fnExtractSoundToMP3(
          filePath.replace('.mpeg', '.mp3'),
          function (error, file) {
            if (error) console.log({ error });
            if (!error) console.log('Audio file: ' + file);
          }
        );
      },
      function (err) {
        console.log('Error: ' + err);
      }
    );
  } catch (e) {
    console.log({ error2: e });
  }
};

const router = express.Router();
//? records mime type is audio/mpeg-3
const mc = new MulterConfig('audio', 'uploads/audios/records/', 'Audios Only');

router.post(
  '/',
  // auth.protectNormalUser,
  mc.upload().single('record'),
  (req, res, next) => {
    convertToMp3(req.file.path);
    next();
  },
  (req, res, next) => {
    res.status(200).json({
      status: 'success',
      path: `${req.protocol}://${req.get('host')}/${req.file.path}`.replace(
        /\\/g,
        '/'
      ),
    });
  }
);

export default router;
