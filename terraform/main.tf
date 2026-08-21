# Terraform Configuration for AgriSmart Cloud Run Deployment
# Provider setup for Google Cloud
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "The Google Cloud Project ID (e.g., agrismart-gateway)"
  type        = string
}

variable "region" {
  description = "The region to deploy to (e.g., europe-west2)"
  type        = string
  default     = "europe-west2"
}

variable "image_url" {
  description = "The URL of the Docker image in Artifact Registry or GCR"
  type        = string
}

# Cloud Run Service Definition
resource "google_cloud_run_v2_service" "agrismart_gateway" {
  name     = "agrismart-cloud-gateway"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0 # Scale to zero for extreme cost efficiency
      max_instance_count = 5 # Limit maximum scaling to prevent cost spikes
    }

    containers {
      image = var.image_url

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
      
      # Environment Variables (Gemini API Key would be injected here via Secret Manager in production)
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}

# Allow public unauthenticated access to the Cloud Run service
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = google_cloud_run_v2_service.agrismart_gateway.project
  location = google_cloud_run_v2_service.agrismart_gateway.location
  name     = google_cloud_run_v2_service.agrismart_gateway.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Output the public URL
output "service_url" {
  value = google_cloud_run_v2_service.agrismart_gateway.uri
}
