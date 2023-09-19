variable "BUCKET_NAME" {
  type        = string
  description = "S3 Bucket name"
}
variable "QUEUE_NAME" {
  type        = string
  description = "name of queue"
}
variable "TABLE_NAME" {
  type        = string
  description = "dynamodb table name"
}
variable "TOPIC_NAME" {
  type        = string
  description = "sns topic name"
}
variable "AWS_REGION" {
  type        = string
  description = "aws region"
}
variable "ACCOUNT_ID" {
  type        = string
  description = "aws account id"
}
variable "WEBHOOK_URL" {
  type        = string
  description = "bot web hook url"
}
variable "UPLOAD_FOLDER" {
  type        = string
  description = "upload folder of s3 bucket"
}