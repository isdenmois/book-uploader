set dotenv-load
APK_PATH := "./app/build/outputs/apk/release/app-release.apk"

web-deploy:
  cd web;nr build
  scp -P $SFTP_PORT -r web/dist $SFTP_USER@$SFTP_HOST:~/$SFTP_TARGET

build-apk:
  rm -f {{APK_PATH}}
  fastlane build_apk

upload-apk:
  curl -i -X POST -H "Content-Type: multipart/form-data" -F "file=@{{APK_PATH}}" $SERVER_URL

android-deploy: build-apk upload-apk
