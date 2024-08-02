terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.34.0"
    }
  }
  required_version = ">= 0.14.0"
}

provider "google" {
  project     = var.project_id
  region      = var.region
  credentials = file("csci-5411-01097e74a6e4.json")
}

# Enable necessary APIs
resource "google_project_service" "serviceusage_api" {
  project = var.project_id
  service = "serviceusage.googleapis.com"
}

resource "google_project_service" "nl_api" {
  project = var.project_id
  service = "language.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

resource "google_project_service" "firestore_api" {
  project = var.project_id
  service = "firestore.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

resource "google_project_service" "bigquery_api" {
  project = var.project_id
  service = "bigquery.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

resource "google_project_service" "looker_studio_api" {
  project = var.project_id
  service = "datastudio.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

resource "google_project_service" "cloud_run_api" {
  project = var.project_id
  service = "run.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

resource "google_project_service" "cloudfunctions_api" {
  project = var.project_id
  service = "cloudfunctions.googleapis.com"
  depends_on = [google_project_service.serviceusage_api]
}

# Generate a random ID for the bucket name
resource "random_id" "default" {
  byte_length = 8
}

# Create a storage bucket
resource "google_storage_bucket" "default" {
  name                        = "${random_id.default.hex}-gcf-source"
  location                    = "US"
  uniform_bucket_level_access = true
}

# Archive each function folder separately
data "archive_file" "add_reviews_zip" {
  type        = "zip"
  output_path = "/tmp/add-reviews-function.zip"
  source_dir  = "cloud-functions/AddReviews"
}

data "archive_file" "data_analytics_zip" {
  type        = "zip"
  output_path = "/tmp/data-analytics-function.zip"
  source_dir  = "cloud-functions/DataAnalytics"
}

data "archive_file" "get_reviews_zip" {
  type        = "zip"
  output_path = "/tmp/get-reviews-function.zip"
  source_dir  = "cloud-functions/GetReviews"
}

# Create storage bucket objects for each function
resource "google_storage_bucket_object" "add_reviews_object" {
  name   = "add-reviews-function.zip"
  bucket = google_storage_bucket.default.name
  source = data.archive_file.add_reviews_zip.output_path
}

resource "google_storage_bucket_object" "data_analytics_object" {
  name   = "data-analytics-function.zip"
  bucket = google_storage_bucket.default.name
  source = data.archive_file.data_analytics_zip.output_path
}

resource "google_storage_bucket_object" "get_reviews_object" {
  name   = "get-reviews-function.zip"
  bucket = google_storage_bucket.default.name
  source = data.archive_file.get_reviews_zip.output_path
}

# Create BigQuery Dataset
resource "google_bigquery_dataset" "users_bigquery_t" {
  dataset_id = "users_bigquery_t"
  project    = var.project_id
  location   = "US"
}

# Define BigQuery Table
resource "google_bigquery_table" "users_login_table" {
  dataset_id = google_bigquery_dataset.users_bigquery_t.dataset_id
  table_id   = "users_login_table_t"
  project    = var.project_id

  schema = jsonencode([
    {
      name = "username"
      type = "STRING"
      mode = "REQUIRED"
    },
    {
      name = "email"
      type = "STRING"
      mode = "REQUIRED"
    },
    {
      name = "isAgent"
      type = "BOOLEAN"
      mode = "NULLABLE"
    },
    {
      name = "dayOfWeek"
      type = "STRING"
      mode = "NULLABLE"
    },
    {
      name = "timestamp"
      type = "TIMESTAMP"
      mode = "REQUIRED"
    }
  ])
}

# Define Cloud Functions
resource "google_cloudfunctions2_function" "add_review_function" {
  name        = "add-review-function"
  location    = var.region
  description = "Add reviews to Firestore with sentiment analysis"

  build_config {
    runtime     = "python38"
    entry_point = "add_review"
    source {
      storage_source {
        bucket = google_storage_bucket.default.name
        object = google_storage_bucket_object.add_reviews_object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    ingress_settings   = "ALLOW_ALL"
    environment_variables = {
      GOOGLE_CLOUD_PROJECT = var.project_id
    }
  }
}

resource "google_cloudfunctions2_function" "store_data_function" {
  name        = "store-data-function"
  location    = var.region
  description = "Store login data in BigQuery"

  build_config {
    runtime     = "python312"
    entry_point = "store_data"
    source {
      storage_source {
        bucket = google_storage_bucket.default.name
        object = google_storage_bucket_object.data_analytics_object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    ingress_settings   = "ALLOW_ALL"
    environment_variables = {
      GOOGLE_CLOUD_PROJECT = var.project_id
    }
  }
}

resource "google_cloudfunctions2_function" "get_reviews_function" {
  name        = "get-reviews-function"
  location    = var.region
  description = "Fetch reviews from Firestore"

  build_config {
    runtime     = "python38"
    entry_point = "get_reviews"
    source {
      storage_source {
        bucket = google_storage_bucket.default.name
        object = google_storage_bucket_object.get_reviews_object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    ingress_settings   = "ALLOW_ALL"
    environment_variables = {
      GOOGLE_CLOUD_PROJECT = var.project_id
    }
  }
}

resource "google_cloud_run_service_iam_member" "add_review_iam" {
  location = google_cloudfunctions2_function.add_review_function.location
  service  = google_cloudfunctions2_function.add_review_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "store_data_iam" {
  location = google_cloudfunctions2_function.store_data_function.location
  service  = google_cloudfunctions2_function.store_data_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "get_reviews_iam" {
  location = google_cloudfunctions2_function.get_reviews_function.location
  service  = google_cloudfunctions2_function.get_reviews_function.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "add_review_function_uri" {
  value = google_cloudfunctions2_function.add_review_function.service_config[0].uri
}

output "store_data_function_uri" {
  value = google_cloudfunctions2_function.store_data_function.service_config[0].uri
}

output "get_reviews_function_uri" {
  value = google_cloudfunctions2_function.get_reviews_function.service_config[0].uri
}
