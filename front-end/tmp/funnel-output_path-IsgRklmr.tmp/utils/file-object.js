import EmberObject from '@ember/object';

export default EmberObject.extend({
  // Name is used for the upload property
  name: '',

  // {Property} Human readable size of the selected file
  size: "0 KB",

  // {Property} Raw file size of the selected file
  rawSize: 0,

  // {Property} Indicates if this file is an image we can display
  isDisplayableImage: false,

  // {Property} String representation of the file
  base64Image: '',

  // {Property} Will be an HTML5 File
  fileToUpload: null,

  // {Property} The acceptable file size in MB
  maximumFileSize: 5,

  // {Property} If a file is currently being uploaded
  isUploading: false,

  // {Property} If the file was uploaded successfully
  isUploaded: false,

  humanReadableFileSize: function (size) {
    var label = "";
    if (size == 0) {
      label = "0 KB";
    } else if (size && !isNaN(size)) {
      var fileSizeInBytes = size;
      var i = -1;
      do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
      } while (fileSizeInBytes > 1024);

      var byteUnits = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
      label += Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
    }
    return label;
  },

  readFile: function () {
    let self = this;
    this.set('isUploading', true);
    this.set('isUploaded', false);
    let fileToUpload = this.get('fileToUpload');
    let isImage = fileToUpload.type.indexOf('image') === 0;

    this.set('name', fileToUpload.name);
    this.set('type', fileToUpload.type);
    this.set('rawSize', fileToUpload.size);
    this.set('size', self.humanReadableFileSize(fileToUpload.size));


    // Create a reader and read the file.
    var reader = new FileReader();
    reader.onprogress = function () {
      self.set('isUploading', true);
      self.set('isUploaded', false);
    };
    reader.onloadend = function (event) {
      self.set('base64Image', event.target.result);
      self.set('isUploading', false);
      self.set('isUploaded', true);
    };
    this.set('isDisplayableImage', false);
    self.set('isUploading', false);
    self.set('isUploaded', true);
    if (isImage) {
      // Don't read anything bigger than 5 MB
      let maxSize = 5* 1024 * 1024;
      if (fileToUpload.size <= maxSize ) {
        this.set('isDisplayableImage', true);
        // Read in the image file from the file explorer.
        reader.readAsDataURL(fileToUpload);
      } else {
        console.log("This is not an acceptable image");
        // Read in the error image file.
        self.set('base64Image', '/assets/images/square-image.png');
      }
    } else {
      console.log("This is not an acceptable image");
      // not an image
      self.set('base64Image', '/assets/images/square-image.png');
    }


  },
  init() {
    this._super(...arguments);
    this.readFile();
  }
});