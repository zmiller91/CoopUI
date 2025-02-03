echo "START"
cd /home/ec2-user/coopui
nohup sudo node standalone/server.js > /dev/null 2> /dev/null < /dev/null &