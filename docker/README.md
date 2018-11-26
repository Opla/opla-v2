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


### How to Install Opla on Windows 10 home system

To run and install Opla on Windows 10 home, one must first install Docker Toolbox from the following link https://docs.docker.com/toolbox/overview/#ready-to-get-started as such : 

 - Click on Docker Quickstart Terminal
 - Download Opla on your computer https://github.com/Opla/opla (clone or download button), download Zip, unzip
 - Change directories to get into unzipped docker (example C:\Users\...\opla-master\docker)
- Run « docker-compose up »
- In VM Oracle, default configuration network advanced parameters, change ports with host IP 127.0.0.1, host port 80, guest port 80
