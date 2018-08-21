#!/bin/bash

script_path=$(dirname "$0")

export COMMIT_MESSAGE=$(git log --format=%B -n 1 $CIRCLE_SHA1)

if ! [[ $HELM_XTRA_ARGS =~ .*--dry-run.* ]]; then
	if [ "$TEST_RESULT" = 0 ]; then
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
fi
