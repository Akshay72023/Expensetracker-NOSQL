const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadedFilesSchema = new Schema({
    fileUrl: {
    type: String
  },
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required: true
  }
});

module.exports = mongoose.model('DownloadedFile',downloadedFilesSchema);