#!/usr/bin/expect -f
set timeout 9999;
spawn git pull origin dev
expect eof;
 
