var Minio = require('minio')
var minioClient = new Minio.Client({
    endPoint: 'docker-dev.butler.edu',
    port: 9002,
    useSSL: true,
    accessKey: 'test',
    secretKey: 'supersecret'
})

module.exports = minioClient;
