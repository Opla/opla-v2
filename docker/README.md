# Opla - docker quick start guide

[![Build Status](https://travis-ci.org/Opla/community-edition.svg?branch=master)](https://travis-ci.org/Opla/community-edition)

In 5 minutes you create your own conversational assistant using this opensource tool.

# Getting started

## Quick start for Unix users (Linux, Mac)

### TL;DR 
```
curl -fsSL https://github.com/opla/opla/raw/master/docker/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

You should then be able to navigate to http://front.localhost/ and create your chatbot.

### From a specific revision/branch/tag :
```
export REV=install-script
curl -fsSL https://github.com/opla/opla/opla/raw/$REV/docker/install.sh -o install.sh
chmod +x install.sh
./install.sh --rev $REV
```

## For Windows (non-unix) users / alternative to install.sh

### Prerequisites
- `docker` and  `docker-compose`

### Build and run

```
docker-compose up
```

You should then be able to navigate to http://front.localhost/ and create your chatbot.
