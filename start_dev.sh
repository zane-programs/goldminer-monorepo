#!/bin/bash
(trap 'kill 0' SIGINT; ./web/start.sh & ./electron/start.sh)
