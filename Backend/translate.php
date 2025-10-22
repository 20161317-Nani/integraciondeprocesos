<?php
require_once __DIR__ . '/vendor/autoload.php';

use Statickidz\GoogleTranslate;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $source = $data['source'] ?? 'auto';
    $target = $data['target'] ?? 'en';
    $text   = $data['text'] ?? '';

    if (empty($text)) {
        echo json_encode(['error' => 'No text provided']);
        exit;
    }

    try {
        $trans = new GoogleTranslate();
        $result = $trans->translate($source, $target, $text);
        echo json_encode(['translation' => $result]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
