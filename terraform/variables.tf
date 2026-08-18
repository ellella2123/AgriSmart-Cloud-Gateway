variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "The GCP region to deploy to (e.g., europe-west2 or us-central1)"
  type        = string
  default     = "europe-west2"
}

variable "container_image" {
  description = "The full path to the Docker container image in Google Artifact Registry (e.g. europe-west2-docker.pkg.dev/your-project/repo/agrismart:latest)"
  type        = string
}
