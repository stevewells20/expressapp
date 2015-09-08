#!/usr/bin/expect -f
#spawn git add --all . 
#spawn git commit -m "Added d3 to modules" 
spawn git push origin testing
expect "'https://github.com': "
send "stevewells20\r"
expect "'https://stevewells20@github.com': "
sleep 1
send "1qazXSW@\r"
sleep 2

