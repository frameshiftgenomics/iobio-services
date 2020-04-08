# Configure the AWS Provider
provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

# # Create a VPC
# resource "aws_vpc" "example" {
#   cidr_block = "10.0.0.0/16"
# }

resource "aws_instance" "web" {
  ami           = "ami-0fc20dd1da406780b"
  instance_type = "m5.2xlarge"

  tags = {
    Name = "iobio-prod"
  }
}
