#!/bin/bash
set -ev

echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo $TRAVIS_COMMIT
echo $TRAVIS_BRANCH

export REPO=opla/front

make build COMMIT=$TRAVIS_COMMIT BUILD=$TRAVIS_BUILD_ID
docker push $REPO:$TRAVIS_COMMIT

if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
	escaped_branch=$(echo $TRAVIS_BRANCH | tr / _)
	docker tag $REPO:$TRAVIS_COMMIT $REPO:$escaped_branch
	docker push $REPO:$escaped_branch
	if [ "${TRAVIS_BRANCH}" == "master" ]; then
		docker tag $REPO:$TRAVIS_COMMIT $REPO:latest
		docker push $REPO:latest
	fi
fi
