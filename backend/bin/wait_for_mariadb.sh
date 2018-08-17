#!/bin/bash

until nc -z -v -w30 127.0.0.1 3306; do
		echo "Waiting for database connection..."
		sleep 1
done
