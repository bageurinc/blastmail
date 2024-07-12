#!/bin/bash
# Direktori tempat menyimpan kunci dan sertifikat
CERT_DIR="/usr/src/app/dkim"

# Buat direktori jika belum ada
mkdir -p "$CERT_DIR"

# Nama file kunci dan sertifikat
KEY_FILE="$CERT_DIR/server-key.pem"
CERT_FILE="$CERT_DIR/server-cert.pem"

# Hapus kunci dan sertifikat lama jika ada
rm -f "$KEY_FILE" "$CERT_FILE"

# Buat kunci dan sertifikat self-signed
openssl req -x509 -newkey rsa:2048 -keyout "$KEY_FILE" -out "$CERT_FILE" -days 365 -nodes -subj "/CN=mail.bablast.id"
