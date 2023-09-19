const { spawnSync } = require("child_process");
const { readFileSync, unlinkSync } = require("fs");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const compressVideo = async () => {
    const fileName = process.env.FileToConvert;
    if (fileName) {
        return convertVideo(fileName);
    } else {
        return returnMessage("error", "File not found");
    }
}
const convertVideo = async (fileName) => {
    const fileNameWithoutExtention = fileName.split(".")[0];
    const convertedFileName = `converted/${fileNameWithoutExtention}.png`;
    const tempFilePath = "/tmp/" + convertedFileName;

    try {
        const getCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
        });
        const inputFileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        spawnSync(
            "ffmpeg",
            ["y", "-i", `${inputFileUrl}`, "-f", "h264", "-s", "852x480", tempFilePath],
            { stdio: "inherit" });
        const convertedFile = readFileSync(tempFilePath);
        unlinkSync(tempFilePath);
        return uploadToBucket(convertedFileName, convertedFile);
    } catch (error) {
        return returnMessage("Error", error);
    }
}
const uploadToBucket = async (fileName, fileContent) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: fileContent
        });
        await s3Client.send(command);
        return returnMessage("Success", "Successfully uploaded to bucket");
    } catch (error) {
        return returnMessage("Error", error);
    }
}
const returnMessage = (status, message) => {
    return ({
        Status: status,
        Message: message
    })
}
module.exports = { compressVideo };