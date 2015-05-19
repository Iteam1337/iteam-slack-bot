docker build -t slack-bot .
docker tag -f slack-bot tutum.co/iteamdev/slack-bot
docker push tutum.co/iteamdev/slack-bot