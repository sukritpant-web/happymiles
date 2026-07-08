<?php
/**
 * Happy Miles — enquiry form handler
 * Receives the contact-form POST, validates it, blocks obvious spam,
 * and emails the enquiry to the address below via the server's mail system.
 *
 * Requires: PHP + a working mail server (standard on DirectAdmin shared hosting).
 */
declare(strict_types=1);

// ---- Settings you can change -------------------------------------------
const RECIPIENT = 'info@happymiles.com.np';        // where enquiries are sent
const FROM      = 'info@happymiles.com.np';        // MUST be a real mailbox on your domain (SPF/DKIM)
const FROM_NAME = 'Happy Miles Website';           // shown as the sender name in your inbox
// ------------------------------------------------------------------------

// Is this a fetch()/AJAX call? Decides JSON vs. plain-HTML response.
$isAjax = (
    (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest')
    || (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false)
);

function respond(bool $ok, string $msg, bool $isAjax): void {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['ok' => $ok, 'message' => $msg]);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        $title = $ok ? 'Thank you — message sent' : "Sorry, that didn't send";
        $color = $ok ? '#22375B' : '#b3261e';
        echo '<!doctype html><meta charset="utf-8"><title>' . htmlspecialchars($title) . '</title>'
           . '<div style="font-family:system-ui,-apple-system,sans-serif;max-width:36rem;margin:4rem auto;'
           . 'padding:0 1.25rem;line-height:1.65;color:#14181f">'
           . '<h1 style="color:' . $color . '">' . htmlspecialchars($title) . '</h1>'
           . '<p>' . htmlspecialchars($msg) . '</p>'
           . '<p><a href="contact.html" style="color:#22375B;font-weight:600">&larr; Back to Happy Miles</a></p></div>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(false, 'Please submit the form.', $isAjax);
}

// Honeypot: the hidden "website" field is invisible to humans. If it's filled,
// it's a bot — quietly report success so it doesn't retry.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(true, 'Thank you — your message has been sent.', $isAjax);
}

$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$type    = trim((string)($_POST['type'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$allowed = ['traveller', 'guide', 'hotel', 'agency', 'organization'];
$missing = [];
if ($name === '' || mb_strlen($name) > 100)          { $missing[] = 'your name'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL))       { $missing[] = 'a valid email address'; }
if ($message === '' || mb_strlen($message) > 5000)    { $missing[] = 'a message'; }
if (!in_array($type, $allowed, true))                 { $type = 'traveller'; }

if ($missing) {
    respond(false, 'Please provide ' . implode(', ', $missing) . '.', $isAjax);
}

// Strip CR/LF to prevent email-header injection.
$safeEmail = preg_replace('/[\r\n]+/', '', $email);
$safeName  = preg_replace('/[\r\n]+/', ' ', $name);

$labels = [
    'traveller' => 'Traveller', 'guide' => 'Guide / driver', 'hotel' => 'Hotel',
    'agency' => 'Travel agency', 'organization' => 'Organization',
];
$typeLabel = $labels[$type] ?? $type;

$subject = "Website enquiry — {$typeLabel} — {$safeName}";
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$body = "New enquiry from the Happy Miles website\n"
      . "----------------------------------------\n\n"
      . "Name:   {$name}\n"
      . "Email:  {$email}\n"
      . "As a:   {$typeLabel}\n\n"
      . "Message:\n{$message}\n\n"
      . "----------------------------------------\n"
      . 'Sent: ' . date('Y-m-d H:i:s') . " (server time)\n";

$headers  = 'From: ' . FROM_NAME . ' <' . FROM . ">\r\n";
$headers .= 'Reply-To: ' . $safeEmail . "\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

$sent = @mail(RECIPIENT, $encodedSubject, $body, $headers, '-f' . FROM);

if ($sent) {
    respond(true, "Thank you — your message has been sent. We'll get back to you soon.", $isAjax);
}
respond(false, "We couldn't send your message right now. Please email info@happymiles.com.np directly.", $isAjax);
