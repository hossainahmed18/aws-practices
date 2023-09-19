resource "aws_dynamodb_table" "dynamodb-table" {
  name             = var.TABLE_NAME
  billing_mode     = "PROVISIONED"
  read_capacity    = 5
  write_capacity   = 5
  hash_key         = "pk"
  range_key        = "sk"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
  attribute {
    name = "gsi1pk"
    type = "S"
  }
  attribute {
    name = "gsi1sk"
    type = "S"
  }
  global_secondary_index {
    name            = "ActivityIndex"
    hash_key        = "gsi1pk"
    range_key       = "gsi1sk"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "ALL"
  }
}
resource "aws_sns_topic" "sns_tipic" {
  name = var.TOPIC_NAME
}

resource "aws_lambda_event_source_mapping" "dynamodb-table" {
  event_source_arn  = aws_dynamodb_table.dynamodb-table.stream_arn
  function_name     = aws_lambda_function.lambda.arn
  starting_position = "LATEST"
}
resource "aws_sns_topic_subscription" "sns_tipic_subscription" {
  topic_arn = aws_sns_topic.sns_tipic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.lambda.arn
}
resource "aws_lambda_permission" "allow_sns_invoke" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.arn
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.sns_tipic.arn
}