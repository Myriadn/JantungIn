package utils

import (
	"crypto/sha256"
	"fmt"
	"strings"
)

// GenerateDeviceFingerprint creates a unique device identifier from User-Agent and IP address.
// The IP is normalized to first 3 octets to handle dynamic IP changes.
// Returns a SHA256 hex string representation.
func GenerateDeviceFingerprint(userAgent, ip string) string {
	// Normalize IP: extract first 3 octets for IPv4 (e.g., 192.168.1.x -> 192.168.1)
	normalizedIP := normalizeIP(ip)

	// Combine User-Agent and normalized IP
	combined := userAgent + "|" + normalizedIP

	// Generate SHA256 hash
	hash := sha256.Sum256([]byte(combined))

	// Return as hex string
	return fmt.Sprintf("%x", hash)
}

// normalizeIP extracts the first 3 octets of an IPv4 address.
// For IPv6 or invalid formats, returns the IP as-is.
func normalizeIP(ip string) string {
	// Handle IPv6 addresses (contains colons)
	if strings.Contains(ip, ":") {
		// For IPv6, return first 3 groups
		parts := strings.Split(ip, ":")
		if len(parts) >= 3 {
			return strings.Join(parts[:3], ":")
		}
		return ip
	}

	// Handle IPv4 addresses
	parts := strings.Split(ip, ".")
	if len(parts) >= 3 {
		return strings.Join(parts[:3], ".")
	}

	// Fallback for invalid format
	return ip
}
