const aws = require("aws-sdk");
const axios = require('axios');
aws.config.update({ region: process.env.AWS_REGION });
const s3 = new aws.S3({ 'signatureVersion': 'v4' });
const { spawnSync } = require("child_process");
const { readFileSync, unlinkSync } = require("fs");
const dynamoDbClient = new aws.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

module.exports.uploadEngine = async (event) => {
  if (event.Records && event.Records[0].eventSource === "aws:s3") {
    return showMessageForS3(event);
  }
  else if (event.Records && event.Records[0].eventSource === "aws:sqs") {
    const body = JSON.parse(event.Records[0].body);
    const filename = body.Records[0].s3.object?.key ?? "No file found";
    if (filename.endsWith('.mp4')) {
      return runEcsTaskToCompressVideo(filename);
    }
    return saveToDynamoDb(filename);
  } else if (event.Records && event.Records[0].eventSource === "aws:dynamodb") {
    return saveSNSTopic(event);
  } else if (event.Records && event.Records[0].EventSource === 'aws:sns') {
    return postToBot(event);
  } else if (event.requestContext?.http?.path === "/userActivity" || event.input) {
    if (event.input) {
      return filterUserActivities(event.input).Message?.Items ?? [];
    }
    const httpRequest = event.requestContext.http;
    if (httpRequest.method === "POST") {
      return saveUserActivityToDynamoDb(event.body);
    } else {
      return filterUserActivities(event.queryStringParameters ?? {});
    }
  } else {
    const key = `${process.env.UPLOAD_FOLDER}/` + event.queryStringParameters?.fileName ?? "file -" + Date.now().toString();
    const uploadURL = getSignedUrl('putObject', key);
    return ({
      uploadURL: uploadURL,
      Key: key
    })
  }
}
const showMessageForS3 = (event) => {
  const filename = event.Records[0].s3.object?.key ?? "File Not found";
  console.log("removed file::" + filename);
  return returnMessage("Success", "Successfully triggered by s3");
}
const saveToDynamoDb = async (filename) => {
  const data = {
    TableName: process.env.TABLE_NAME,
    Item: {
      'Message': filename
    }
  }
  try {
    await dynamoDbClient.put(data).promise();
    return returnMessage("Success", "Successfully saved to Dynamodb");
  } catch (error) {
    return returnMessage("Error", error);
  }
}
const saveSNSTopic = async (event) => {
  const eventMessage = "User: Junayed, Action: " + event.Records[0].eventName ?? "Error with Event";
  const fileName = "file: " + event.Records[0].dynamodb.NewImage?.Message?.S ?? "File Name Not found";
  const message = eventMessage + fileName;
  const snsParam = {
    Message: message,
    TopicArn: `arn:aws:sns:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:${process.env.TOPIC_NAME}`
  };
  try {
    const snsClinet = new aws.SNS();
    await snsClinet.publish(snsParam).promise();
    return returnMessage("Success", "Successfully saved to SNS Topic");
  } catch (error) {
    return returnMessage("Error", error);
  }
}
const postToBot = async (event) => {
  const message = "Serverless Task:::  " + "Message from SNS via SQS: " + event.Records[0].Sns.Message ?? "Error with SNS";
  const headers = {
    'Content-Type': 'application/json'
  }
  try {
    await axios.post(process.env.WEBHOOK_URL, { 'content': message }, { headers: headers });
    return returnMessage("Success", "Successfully posted to BOT");
  } catch (error) {
    return returnMessage("Error", error);
  }
}

const convertVideo = (fileName) => {
  const downLoadUrl = getSignedUrl('getObject', fileName);
  const fileNameWithoutExtention = fileName.split(".")[0];
  const convertedFileName = `converted/${fileNameWithoutExtention}.mp4`;
  const tempFilePath = "/tmp/" + convertedFileName;

  try {
    spawnSync(
      "/opt/ffmpeg",
      ["y", "-i", `${downLoadUrl}`, "-f", "h264", "-s", "852x480", tempFilePath],
      { stdio: "inherit" });
    const convertedFile = readFileSync(tempFilePath);
    unlinkSync(tempFilePath);
    return uploadToBucket(convertedFileName, convertedFile);
  } catch (error) {
    return returnMessage("Error", error);
  }
}

const getSignedUrl = (objectAction, key) => {
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Expires: 30000
  }
  return s3.getSignedUrl(objectAction, s3Params);
}

const uploadToBucket = async (fileName, fileContent) => {
  try {
    await s3.putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileContent
    }).promise();
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

const saveUserActivityToDynamoDb = async (requestBody) => {
  const userActivityInfo = JSON.parse(requestBody);
  if (validateUserActivtyInput(userActivityInfo)) {
    const dbRecord = {
      customer: userActivityInfo.customer,
      user: userActivityInfo.user,
      uploadTime: userActivityInfo.uploadTime,
      pk: getPkForUserActivity(userActivityInfo),
      sk: getSkForUserActivity(userActivityInfo),
      fileName: userActivityInfo.fileName,
      fileSize: userActivityInfo.fileSize,
      fileType: userActivityInfo.fileType,
      gsi1pk: "USER_ACTIVITY",
      gsi1sk: getGsi1SkForUserActivity(userActivityInfo)
    };
    try {
      await dynamoDbClient.put({ TableName: process.env.TABLE_NAME, Item: dbRecord }).promise();
      return returnMessage("Success", "Successfully saved to Dynamodb");
    } catch (error) {
      return returnMessage("Error", error);
    }
  } else {
    return returnMessage("Error", "required fileds are missing");
  }
}

const validateUserActivtyInput = (requestBody) => {
  const requiredFileds = ["customer", "user", "uploadTime", "fileName", "fileSize", "fileType"];
  return requiredFileds.every(field => requestBody[field]?.length > 0);
}

const filterUserActivities = async (filterOptions) => {
  const queryParam = {
    TableName: process.env.TABLE_NAME,
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    KeyConditionExpression: {}
  }
  setQuryForPartitionKeys(filterOptions, queryParam);
  if (filterOptions.user || (filterOptions.customer && Object.keys(queryParam.ExpressionAttributeNames).includes('gsi1pk'))) {
    setQuryForSortKeys(filterOptions, queryParam);
  }
  try {
    const result = await dynamoDbClient.query(queryParam).promise();
    return returnMessage("Success", result);
  } catch (error) {
    console.log(error);
    return returnMessage("Error", queryParam);
  }
}
const setQuryForPartitionKeys = (filterOptions, queryParam) => {
  let keyName = "";
  queryParam.KeyConditionExpression = `#${keyName} = :${keyName}`;
  if ((filterOptions.customer && filterOptions.user) || (filterOptions.customer && Object.keys(filterOptions).length === 1)) {
    keyName = "pk";
    queryParam.ExpressionAttributeValues[':' + keyName] = filterOptions.customer;
  } else {
    keyName = "gsi1pk";
    queryParam.ExpressionAttributeValues[':' + keyName] = "USER_ACTIVITY";
    queryParam.IndexName = 'ActivityIndex';
  }
  queryParam.ExpressionAttributeNames['#' + keyName] = keyName;
  queryParam.KeyConditionExpression = `#${keyName} = :${keyName}`;
}

const setQuryForSortKeys = (filterOptions, queryParam) => {
  let sortKeyName = "";
  let sortKeyPrefix = "";
  if (filterOptions.user) {
    sortKeyName = "sk";
    sortKeyPrefix = filterOptions.user;

  } else {
    sortKeyName = "gsi1sk";
    sortKeyPrefix = filterOptions.customer;
  }
  queryParam.ExpressionAttributeNames['#' + sortKeyName] = sortKeyName;
  if (filterOptions.startDate && filterOptions.endDate) {
    queryParam.ExpressionAttributeValues[':startDate'] = sortKeyPrefix + '-' + filterOptions.startDate;
    queryParam.ExpressionAttributeValues[':endDate'] = sortKeyPrefix + '-' + filterOptions.endDate;
    queryParam.KeyConditionExpression = queryParam.KeyConditionExpression + ` AND #${sortKeyName} BETWEEN :startDate AND :endDate`;
  } else {
    queryParam.ExpressionAttributeValues[':' + sortKeyName] = filterOptions.user;
    queryParam.KeyConditionExpression = queryParam.KeyConditionExpression + ` AND begins_with(#${sortKeyName}, :${sortKeyName})`;
  }
}
const getPkForUserActivity = (userActivityInfo) => {
  return userActivityInfo.customer;
}
const getSkForUserActivity = (userActivityInfo) => {
  return userActivityInfo.user + '-' + userActivityInfo.uploadTime;
}
const getGsi1SkForUserActivity = (userActivityInfo) => {
  return userActivityInfo.customer + '-' + userActivityInfo.uploadTime;
}
const runEcsTaskToCompressVideo = async (fileName) => {
  const ecs = new aws.ECS();
  const params = {
    taskDefinition: process.env.TASK_DEFINITION,
    cluster: 'default',
    launchType: 'FARGATE',
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [
          process.env.SUB_NET
        ]
      }
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.CONTAINER_NAME,
          environment: [
            {
              name: 'BUCKET_NAME',
              value: process.env.BUCKET_NAME
            },
            {
              name: 'FileToConvert',
              value: fileName
            }
          ]
        }
      ],
    },
  };
  try {
    await ecs.runTask(params).promise();
    return returnMessage("Success", "Video compressed and saved to s3")
  } catch (error) {
    return returnMessage("Error", error);
  }
}