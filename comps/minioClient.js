var Minio = require('minio')
var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9002,
    useSSL: false,
    accessKey: 'test',
    secretKey: 'supersecret'
})

module.exports = minioClient;