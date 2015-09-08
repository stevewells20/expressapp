#!/usr/bin/expect -f
#spawn git add --all . 
#spawn git commit -m "Added d3 to modules" 
spawn git push origin testing
expect "'https://github.com': "
sleep 1
send "stevewells20\n"
expect "'https://stevewells20@github.com': "
sleep 1
send "1qazXSW@\n\n"
sleep 2
expect eof;

