const AWS= require('aws-sdk');
require("dotenv").config();

const uploadToS3 = (data, filename) => { 
 let s3Bucket = new AWS.S3( {
     accessKeyId: process.env.ACCESS_KEY,
     secretAccessKey: process.env.SECRET_KEY
 })

const params = {
    Bucket: process.env.BUCKET_NAME,
    Key : filename,
    Body:data,
    ACL:'public-read'
}
return new Promise((resolve,reject) => {
    s3Bucket.upload(params, (err, s3response) => {
        if(err) {
            console.log('something went wrong',err);
            reject(err);
        } else {
            console.log('success',s3response);
            resolve(s3response.Location);
             }
         })
     })                                                                                                          
 }

 module.exports = {uploadToS3};