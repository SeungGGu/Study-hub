#!/bin/bash

# Node.js 애플리케이션 시작
echo "Starting npm application..."
npm start &

# Docker 컨테이너 실행
echo "Starting Docker container..."
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=1234 openvidu/openvidu-server-kms:2.23.0 &

# Spring Boot 애플리케이션 시작
echo "Starting Spring Boot application..."
./gradlew bootRun
