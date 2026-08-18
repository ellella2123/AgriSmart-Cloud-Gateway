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

# The Cloud Run V2 service representing the AgriSmart web app + USSD webhook
resource "google_cloud_run_v2_service" "agrismart_ussd_gateway" {
  name     = "agrismart-ussd-gateway"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      # Scale to 0 ensures 100% free operation when not receiving USSD pings
      max_instance_count = 2
      min_instance_count = 0  
    }
    
    containers {
      image = var.container_image
      
      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      # Mount the Gemini API Key from Google Secret Manager (Optional Best Practice)
      # env {
      #   name = "GEMINI_API_KEY"
      #   value_source {
      #     secret_key_ref {
      #       secret  = google_secret_manager_secret.gemini_key.secret_id
      #       version = "latest"
      #     }
      #   }
      # }
    }
  }
}

# Make the Cloud Run service accessible publicly for Telco webhooks and public web access
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.agrismart_ussd_gateway.name
  location = google_cloud_run_v2_service.agrismart_ussd_gateway.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
