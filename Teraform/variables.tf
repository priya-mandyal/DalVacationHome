variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
  default     = "csci-5411"
}

variable "region" {
  description = "The region to deploy resources in"
  type        = string
  default     = "us-central1"
}
