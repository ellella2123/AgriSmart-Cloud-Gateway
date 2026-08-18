output "cloud_run_url" {
  description = "The public URL of the deployed AgriSmart USSD Gateway"
  value       = google_cloud_run_v2_service.agrismart_ussd_gateway.uri
}

output "ussd_webhook_endpoint" {
  description = "The specific endpoint to configure in the Telco/Africa's Talking dashboard"
  value       = "${google_cloud_run_v2_service.agrismart_ussd_gateway.uri}/api/ussd/callback"
}

output "sms_webhook_endpoint" {
  description = "The specific endpoint to configure for incoming SMS messages"
  value       = "${google_cloud_run_v2_service.agrismart_ussd_gateway.uri}/api/sms/callback"
}
