const QRCode = require('qrcode');

const url = "www.google.com"

QRCode.toFile('public/file.png', url, {
  errorCorrectionLevel: 'H'
}, function(err) {
  if (err) throw err;
  console.log('QR code saved!');
});

QRCode.toDataURL(url, function (err, url) {
    if (err) throw err;
    console.log(url);
});
