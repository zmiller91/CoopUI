
if [ $(ps -aux | grep server.js | grep -v grep | awk '{print $2}' | wc -l) -ne 0 ]; then
    ps -aux | grep server.js | grep -v grep | awk '{print $2}' | xargs sudo kill
fi