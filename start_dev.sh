#!/bin/bash
#./electron/start.sh & ./web/start.sh && kill $!
(trap 'kill 0' SIGINT; ./web/start.sh & ./electron/start.sh)
