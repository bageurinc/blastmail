# Gunakan versi Node.js terbaru sebagai base image
FROM node:latest

# Tentukan direktori kerja
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi Node.js
RUN npm install

# Salin semua file sumber ke dalam container
COPY . .

# Buka port 465 untuk layanan SMTPS
EXPOSE 465

# Jalankan server SMTP saat container dimulai
CMD ["node", "smtpServer.js"]
