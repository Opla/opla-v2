#!/bin/sh
set -x

STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" 'http://backend:80/auth/user' -H 'content-type: application/json' -H 'accept: application/json' --data-binary '{"client_id": "{{.Values.db.auth.clientId}}","email":"{{.Values.default_user.email}}","username":"{{.Values.default_user.username}}","password":"{{.Values.default_user.password}}","accept": "true"}' --compressed)

if [ "$STATUS_CODE" != 200 ]; then
exit 1
fi;
