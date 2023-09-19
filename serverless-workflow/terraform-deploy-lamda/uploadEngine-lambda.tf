terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "junayeds-services-dev-serverlessdeploymentbucket-1nycirrxa283u"
    key    = "terraform/states"
    region = "ap-northeast-1"
  }
}
provider "aws" {
  region = var.AWS_REGION
}
resource "aws_iam_role" "iam_for_lambda" {
  name = "junayed_iam_for_lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "../junayed-serverlesss-lambda/handler.js"
  output_path = "lambda_function.zip"
}

resource "aws_lambda_layer_version" "lambda_layer_node" {
  filename   = "JunayedNodejs-88424c1f-2137-4adc-889d-ed2fa35d2c0c.zip"
  layer_name = "JunayedNodejsterraform"

  compatible_runtimes      = ["nodejs16.x"]
  compatible_architectures = ["x86_64"]
}

resource "aws_lambda_layer_version" "lambda_layer_ffmpeg" {
  s3_bucket  = "junayeds-services-dev-serverlessdeploymentbucket-1nycirrxa283u"
  s3_key     = "JunayedFfmpeg-89ef3f2c-c1db-4c2a-be70-67b08506ab4a.zip"
  layer_name = "Junayedffmpegterraform"
}

resource "aws_lambda_function" "lambda" {
  filename         = "lambda_function.zip"
  function_name    = "junayed_lambda_terraform"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "handler.uploadEngine"
  source_code_hash = data.archive_file.lambda_zip.output_path
  runtime          = "nodejs16.x"
  environment {
    variables = {
      BUCKET_NAME   = "${var.BUCKET_NAME}"
      TABLE_NAME    = "${var.TABLE_NAME}"
      TOPIC_NAME    = "${var.TOPIC_NAME}"
      WEBHOOK_URL   = "${var.WEBHOOK_URL}"
      ACCOUNT_ID    = "${var.ACCOUNT_ID}"
      UPLOAD_FOLDER = "${var.UPLOAD_FOLDER}"
    }
  }
  layers = [aws_lambda_layer_version.lambda_layer_node.arn, aws_lambda_layer_version.lambda_layer_ffmpeg.arn]
}

resource "aws_cloudwatch_log_group" "could_watch" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}