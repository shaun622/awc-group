<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$firstName = htmlspecialchars($input['firstName'] ?? '', ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars($input['lastName'] ?? '', ENT_QUOTES, 'UTF-8');
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars($input['phone'] ?? '', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($input['message'] ?? '', ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($input['service'] ?? 'general', ENT_QUOTES, 'UTF-8');

if (!$firstName || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and email are required']);
    exit;
}

$serviceLabels = [
    'pest-control' => 'Pest Control',
    'fire-safety' => 'Fire Safety',
    'hygiene-services' => 'Hygiene Services',
    'multiple' => 'Multiple Services',
    'other' => 'Other',
    'general' => 'General Enquiry',
];
$serviceLabel = $serviceLabels[$service] ?? ucfirst($service);

$serviceColors = [
    'pest-control' => '#16a34a',
    'fire-safety' => '#dc2626',
    'hygiene-services' => '#2563eb',
    'multiple' => '#1e3a5f',
    'other' => '#1e3a5f',
    'general' => '#1e3a5f',
];
$color = $serviceColors[$service] ?? '#1e3a5f';

$htmlBody = "
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
  .header { background: {$color}; padding: 32px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 32px; }
  .field { margin-bottom: 20px; }
  .field-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .field-value { font-size: 16px; color: #1f2937; line-height: 1.5; }
  .message-box { background: #f9fafb; border-left: 3px solid {$color}; padding: 16px; margin-top: 8px; border-radius: 0 8px 8px 0; }
  .footer { padding: 24px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
</style>
</head>
<body>
<div class='container'>
  <div class='header'>
    <h1>New Quote Request</h1>
    <p>{$serviceLabel}</p>
  </div>
  <div class='body'>
    <div class='field'>
      <div class='field-label'>Name</div>
      <div class='field-value'>{$firstName} {$lastName}</div>
    </div>
    <div class='field'>
      <div class='field-label'>Email</div>
      <div class='field-value'><a href='mailto:{$email}'>{$email}</a></div>
    </div>
    <div class='field'>
      <div class='field-label'>Phone</div>
      <div class='field-value'>{$phone}</div>
    </div>
    <div class='field'>
      <div class='field-label'>Message</div>
      <div class='message-box'>{$message}</div>
    </div>
  </div>
  <div class='footer'>
    AWC Group &mdash; awcgroup.uk
  </div>
</div>
</body>
</html>";

$data = [
    'from' => 'AWC Group <quotes@contact.awcgroup.uk>',
    'to' => [NOTIFY_EMAIL],
    'subject' => "New {$serviceLabel} Quote — {$firstName} {$lastName}",
    'html' => $htmlBody,
    'reply_to' => $email,
];

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . RESEND_API_KEY,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($data),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'message' => 'Quote request sent']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email', 'details' => json_decode($response)]);
}
