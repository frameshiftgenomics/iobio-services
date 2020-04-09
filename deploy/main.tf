# Use an S3 bucket to store terraform state remotely.
# https://www.terraform.io/docs/state/remote.html
terraform {
  backend "s3" {
    bucket = "nebula-terraform-state"
    key    = "iobio.tfstate"
    region = "us-east-1"
  }
}

# Configure the AWS Provider
provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

resource "aws_instance" "iobio" {
  ami                  = "ami-07ebfd5b3428b6f4d"
  instance_type        = "m5.2xlarge"
  iam_instance_profile = aws_iam_instance_profile.instance_profile.name

  root_block_device {
    volume_type = "gp2"
    volume_size = 150
  }

  tags = {
    Name = "iobio-prod"
  }
}

resource "aws_eip" "eip" {
  instance = aws_instance.iobio.id
}

data "aws_iam_policy_document" "instance-assume-role-policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "instance" {
  name               = "AmazonS3FullAccessForEC2Iobio"
  assume_role_policy = data.aws_iam_policy_document.instance-assume-role-policy.json
}

data "aws_iam_policy_document" "s3_read_access" {
  statement {
    actions = [
      "s3:*",
    ]

    resources = [
      "arn:aws:s3:::nebula-iobio-services",
      "arn:aws:s3:::nebula-iobio-services/*",
    ]
  }
}

resource "aws_iam_policy" "s3_read_access" {
  name   = "S3ReadAccessIobio"
  policy = data.aws_iam_policy_document.s3_read_access.json
}

resource "aws_iam_role_policy_attachment" "attach_role" {
  role       = aws_iam_role.instance.name
  policy_arn = aws_iam_policy.s3_read_access.arn
}

resource "aws_iam_instance_profile" "instance_profile" {
  name = "AmazonS3FullAccessForEC2Iobio"
  role = aws_iam_role.instance.name
}
