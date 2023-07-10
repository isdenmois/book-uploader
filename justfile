set dotenv-load

web-deploy:
  cd web;nr build
  scp -P $SFTP_PORT -r web/dist $SFTP_USER@$SFTP_HOST:~/$SFTP_TARGET
