resource "aws_iam_role_policy" "dynamodb_lambda_policy" {
  name   = "lambda-dynamodb-policy"
  role   = aws_iam_role.iam_for_lambda.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Sid": "AllowLambdaFunctionInvocation",
        "Effect": "Allow",
        "Action": [
            "lambda:InvokeFunction"
        ],
        "Resource": [
            "${aws_dynamodb_table.dynamodb-table.arn}/stream/*"
        ]
    },
    {
        "Effect": "Allow",
        "Action": [
            "dynamodb:*"
        ],
        "Resource": "${aws_dynamodb_table.dynamodb-table.arn}"
    },
    {
        "Sid": "APIAccessForDynamoDBStreams",
        "Effect": "Allow",
        "Action": [
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:DescribeStream",
            "dynamodb:ListStreams"
        ],
        "Resource": "${aws_dynamodb_table.dynamodb-table.arn}/stream/*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "dynamodb:*"
        ],
        "Resource": "${aws_dynamodb_table.dynamodb-table.arn}/index/*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "sns:*"
        ],
        "Resource": "${aws_sns_topic.sns_tipic.arn}*"
    },
    {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::${var.BUCKET_NAME}/*"
      },
     {
            "Effect": "Allow",
            "Action": [
                "sqs:*"
            ],
            "Resource": "arn:aws:sqs:*:*:${var.QUEUE_NAME}"
       }
  ]
}
EOF
}