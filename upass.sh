#!/usr/bin/expect -f
set timeout 20;
spawn git add --all .
expect eof; 
spawn git commit -m "Added d3 to modules" 
expect eof;
spawn git push origin testing
expect "'https://github.com': "
sleep 1
send "stevewells20\n"
expect "'https://stevewells20@github.com': "
sleep 1
send "1qazXSW@\n\n"
expect eof;

