#!/bin/bash

# It is important for this not to output anything before it actually IS connected
# in order for Travis to stop the build if this retries forever (no stdout, Travis
# will stop the build after 10 minutes).

until curl --fail http://front.localhost/ && echo "Connected to Opla Frontend !"
do
  sleep 5
done
