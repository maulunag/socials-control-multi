<?php
/**
 * Simple JWT utility class without dependencies.
 */

class JWTUtil {
    private static $secret = 'your_super_secret_key_tampateks_multi'; // In production, move to .env

    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64url_decode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }

    public static function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $base64UrlHeader = self::base64url_encode($header);
        $base64UrlPayload = self::base64url_encode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret, true);
        $base64UrlSignature = self::base64url_encode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode($jwt) {
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) != 3) {
            throw new Exception("Invalid token structure.");
        }
        
        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signatureProvided = $tokenParts[2];
        
        $payloadData = json_decode(self::base64url_decode($payload), true);
        
        // Ensure token has not expired
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            throw new Exception("Token has expired.");
        }
        
        // Verify signature
        $signature = hash_hmac('sha256', $header . "." . $payload, self::$secret, true);
        $base64UrlSignature = self::base64url_encode($signature);
        
        if (!hash_equals($base64UrlSignature, $signatureProvided)) {
            throw new Exception("Invalid signature.");
        }
        
        return $payloadData;
    }
}
