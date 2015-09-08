#!/usr/bin/expect -f
spawn git pull origin testing
expect eof;
 
