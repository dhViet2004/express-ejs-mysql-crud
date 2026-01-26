# Sử dụng Node.js phiên bản mới ổn định
FROM node:20

# Tạo thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file cấu hình package
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng (theo file App.js là 3000)
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["node", "App.js"]