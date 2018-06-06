#!/bin/bash

script_path=$(dirname "$0")

# export KUBECTL_OUTPUT=$(kubectl get pods | sed '{:q;N;s/\n/\\n/g;t q}')

if [ "$TRAVIS_TEST_RESULT" = 0 ]; then
	envsubst <$script_path/success.json |
		curl -X POST -H 'Content-type: application/json' \
			--data @- \
			${SLACK_HOOK}

else
	envsubst <$script_path/failure.json |
		curl -X POST -H 'Content-type: application/json' \
			--data @- \
			${SLACK_HOOK}
fi
