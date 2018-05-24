#!/bin/bash

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
	echo "** Exiting."
	exit 0
}

# If there is an existing configuration
# given as a volume, just take it.
if [ -f config/config.json ]; then
	cp config/config.json config/default.json
else
	touch /tmp/foo
	while true; do
		echo "Connecting to the backend at '${OPLA_BACKEND_HOST}:${OPLA_BACKEND_PORT}'..."
		up=$(wget -o /tmp/foo ${OPLA_BACKEND_HOST}:${OPLA_BACKEND_PORT}/api/v1/admin/languages | grep '200' /tmp/foo | wc -l)
		echo $up
		if [ "$up" -eq "1" ]; then
			break
		fi

		echo "wait backend to be up !"
		sleep 2
	done

	./bin/opla init --non-interactive \
		--overwrite \
		--client-name ${OPLA_FRONT_CLIENT_NAME} \
		--api-host ${OPLA_BACKEND_HOST} \
		--api-domain ${OPLA_API_DOMAIN} \
		--api-port ${OPLA_BACKEND_PORT} \
		--api-protocol ${OPLA_BACKEND_PROTOCOL}

fi

yarn rebuild:prod || echo "Could not rebuild prod"

echo "Running node..."
node --inspect dist/
