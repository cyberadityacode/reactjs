<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['access_token']) || !isset($input['project_id'])) {
    echo json_encode(["error" => "Missing access_token or project_id"]);
    exit();
}

$access_token = $input['access_token'];
$project_id = $input['project_id'];

// Check if Firestore databases exist
$url = "https://firestore.googleapis.com/v1/projects/{$project_id}/databases";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$access_token}"
]);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code == 200) {
    $data = json_decode($response, true);
    if (isset($data['databases']) && count($data['databases']) > 0) {
        echo json_encode(["has_firestore" => true, "databases" => $data['databases'], "created" => false]);
    } else {
        // No databases, try to create default
        $create_url = "https://firestore.googleapis.com/v1/projects/{$project_id}/databases?databaseId=(default)";
        $create_data = json_encode([
            "type" => "FIRESTORE_NATIVE",
            "locationId" => "us-central1"
        ]);

        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $create_url);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, $create_data);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer {$access_token}",
            "Content-Type: application/json"
        ]);
        $create_response = curl_exec($ch2);
        $create_http_code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
        curl_close($ch2);

        if ($create_http_code == 200 || $create_http_code == 201) {
            echo json_encode(["has_firestore" => true, "created" => true, "message" => "Firestore database created successfully in us-central1"]);
        } else {
            $create_data_parsed = json_decode($create_response, true);
            $error_message = isset($create_data_parsed['error']['message']) ? $create_data_parsed['error']['message'] : "Unknown error";
            echo json_encode(["has_firestore" => false, "created" => false, "error" => "Failed to create Firestore: {$error_message}", "http_code" => $create_http_code]);
        }
    }
} else {
    // If we get a 403, it might mean Firestore API is not enabled or no databases exist
    // Try to create a database directly
    if ($http_code == 403) {
        // Try to create default database directly
        $create_url = "https://firestore.googleapis.com/v1/projects/{$project_id}/databases?databaseId=(default)";
        $create_data = json_encode([
            "type" => "FIRESTORE_NATIVE",
            "locationId" => "us-central1"
        ]);

        $ch2 = curl_init();
        curl_setopt($ch2, CURLOPT_URL, $create_url);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_POST, true);
        curl_setopt($ch2, CURLOPT_POSTFIELDS, $create_data);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer {$access_token}",
            "Content-Type: application/json"
        ]);
        $create_response = curl_exec($ch2);
        $create_http_code = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
        curl_close($ch2);

        if ($create_http_code == 200 || $create_http_code == 201) {
            echo json_encode(["has_firestore" => true, "created" => true, "message" => "Firestore database created successfully in us-central1"]);
        } else {
            $create_data_parsed = json_decode($create_response, true);
            $error_message = isset($create_data_parsed['error']['message']) ? $create_data_parsed['error']['message'] : "Unknown error";
            echo json_encode(["has_firestore" => false, "created" => false, "error" => "Failed to create Firestore: {$error_message}", "http_code" => $create_http_code, "original_error" => "Access denied to project or Firestore API not enabled"]);
        }
    } else {
        $error_data = json_decode($response, true);
        $error_message = isset($error_data['error']['message']) ? $error_data['error']['message'] : "Failed to fetch Firestore data";
        if ($http_code == 404) {
            $error_message = "Project not found";
        } elseif ($http_code == 401) {
            $error_message = "Invalid or expired access token";
        }
        echo json_encode(["error" => $error_message, "http_code" => $http_code]);
    }
}
?>