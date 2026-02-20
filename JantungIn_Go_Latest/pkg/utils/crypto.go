package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
)

// EncryptNIK mengenkripsi teks menggunakan AES-256-GCM
func EncryptNIK(plaintext string, secretKey string) (string, error) {
	// Pastikan secretKey panjangnya 32 byte (dari file .env)
	block, err := aes.NewCipher([]byte(secretKey))
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Membuat nonce (sejenis IV) yang ukurannya standar GCM (biasanya 12 byte)
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Enkripsi dan gabungkan nonce di depan ciphertext
	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)

	// Kembalikan dalam format Hex string agar mudah disimpan di database
	return hex.EncodeToString(ciphertext), nil
}

// DecryptNIK mendekripsi teks hex menggunakan AES-256-GCM
func DecryptNIK(cipherHex string, secretKey string) (string, error) {
	data, err := hex.DecodeString(cipherHex)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher([]byte(secretKey))
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext terlalu pendek")
	}

	// Pisahkan nonce dan ciphertext yang sebenarnya
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]

	// Dekripsi data
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
