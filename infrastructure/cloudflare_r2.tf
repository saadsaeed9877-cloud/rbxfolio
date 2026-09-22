# Cloudflare R2 Terraform Configuration
# Manages bucket creation, CORS, lifecycle rules, and custom domains

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# Configure the Cloudflare Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Variables
variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "bucket_name" {
  description = "R2 Bucket name"
  type        = string
  default     = "rbxfolio-media"
}

variable "bucket_region" {
  description = "R2 Bucket region"
  type        = string
  default     = "auto"
}

variable "custom_domain" {
  description = "Custom domain for R2 bucket"
  type        = string
  default     = "cdn.rbxfolio.com"
}

variable "cors_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["https://rbxfolio.com", "https://www.rbxfolio.com"]
}

# R2 Bucket
resource "cloudflare_r2_bucket" "media" {
  account_id = var.cloudflare_account_id
  bucket_name = var.bucket_name
  location    = var.bucket_region
}

# Bucket Public Access Configuration
resource "cloudflare_r2_bucket_cors" "media" {
  account_id = var.cloudflare_account_id
  bucket     = cloudflare_r2_bucket.media.bucket_name

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = var.cors_origins
    expose_headers  = ["ETag", "x-amz-version-id"]
    max_age_seconds = 3000
  }
}

# Lifecycle Rules (Optional - if supported)
# Note: Lifecycle rules may not be available through Terraform yet
# Configure through Cloudflare Dashboard manually

# Custom Domain (Optional - if domain is managed in Cloudflare)
# This would require the domain to be in Cloudflare with zone_id
resource "cloudflare_record" "r2_cdn" {
  count   = var.custom_domain != "" ? 1 : 0
  
  zone_id = var.cloudflare_zone_id  # You'll need to add this variable
  name    = trimsuffix(var.custom_domain, ".example.com")
  type    = "CNAME"
  value   = "${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  ttl     = 3600
  proxied = true
}

# Outputs
output "bucket_name" {
  value       = cloudflare_r2_bucket.media.bucket_name
  description = "R2 Bucket name"
}

output "bucket_endpoint" {
  value       = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  description = "R2 Bucket endpoint"
}

output "public_url" {
  value       = var.custom_domain != "" ? "https://${var.custom_domain}" : "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  description = "Public URL for R2 bucket"
}

output "account_id" {
  value       = var.cloudflare_account_id
  description = "Cloudflare Account ID"
}
