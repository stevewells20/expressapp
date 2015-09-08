#!/usr/bin/expect -f
set timeout 9999;
spawn git pull origin testing
expect eof;
 
