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
  // TODO Use data source to find lastest iobio-services ami in our account
  ami                    = "ami-07ebfd5b3428b6f4d"
  instance_type          = "m5.2xlarge"
  vpc_security_group_ids = [aws_security_group.allow_http.id]

  tags = {
    Name = "iobio-prod"
  }
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP/HTTPS inbound traffic"

  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_eip" "eip" {
  instance = aws_instance.iobio.id
}
