#!/bin/sh
set -x

STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" 'http://backend:80/api/v1/bots' -H 'content-type: application/json' -H 'accept: application/json' -H 'client_id: {{.Values.db.auth.clientId}}' --data-binary '{"name":"{{.Values.default_user.bot_name}}","email":"{{.Values.default_user.email}}","username":"{{.Values.default_user.username}}","password":"{{.Values.default_user.password}}","template":{{.Values.default_user.template}},"language":null}' --compressed)

if [ "$STATUS_CODE" != 200 ]; then
exit 1
fi;
