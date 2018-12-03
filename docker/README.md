# Opla - docker quick start guide [![Build Status](https://travis-ci.org/Opla/opla.svg?branch=master)](https://travis-ci.org/Opla/opla)

In 5 minutes you create your own conversational assistant using this opensource tool.

# Getting started

## Quick start for Unix users (Linux, Mac)

### TL;DR 
```
curl -fsSL https://github.com/opla/opla/raw/master/docker/install.sh -o install.sh
chmod +x install.sh
./install.sh
```

You should then be able to navigate to `http://localhost/` and create your chatbot.

### From a specific revision/branch/tag :
```
export REV=<branch|tag|commit_sha>
curl -fsSL https://github.com/opla/opla/raw/$REV/docker/install.sh -o install.sh
chmod +x install.sh
./install.sh --rev $REV
```

## For Windows (non-unix) users / alternative to install.sh


### How to Install Opla manually

To run and install Opla on Windows or MacOs, you must first install Docker Toolbox from the following link https://docs.docker.com/toolbox/overview/#ready-to-get-started

After installation 

 - Start Docker Quickstart Terminal
 - Choose a target directory
 - Run `git clone https://github.com/Opla/opla.git`
 - Run `cd opla/docker`
- Run `docker-compose up `
- Open VM Oracle VirtualBox, choose default configuration > network > advanced parameters, ports redirections, add a new entry:
name=http host port=80, guest port=80

You should then be able to navigate to http://localhost/ and create your chatbot.
