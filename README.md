# opla-backend

[![Build
Status](https://travis-ci.org/Opla/backend.svg?branch=master)](https://travis-ci.org/Opla/backend)

Opla.ai Backend using Node es7 react and redux.


## Getting started

### Prerequisites

First of all, make sure you have [Node 8.x](https://nodejs.org/en/download/) and
[Yarn](https://yarnpkg.com/en/docs/install) installed.

You will also need [MariaDB 10.2](https://mariadb.org/). We provide a [Docker
Compose](https://docs.docker.com/compose/) configuration to get you started
quickly.

### Installation

1. Install the (dev) dependencies:

    ```
    $ yarn install
    ```

2. If you do not want to use Docker Compose, configure your MariaDB instance and
   run the `bin/opla init` command to configure this project. If you use Docker
   Compose, run:

   ```
   $ docker-compose up -d
   ```

3. Start the dev environment:

    ```
    $ yarn dev
    ```

This application should be available at: http://127.0.0.1:8081/.


## Contributing

Please, see the [CONTRIBUTING](CONTRIBUTING.md) file.


## Contributor Code of Conduct

Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.


## License

opla-front is released under the GPL v2.0+ License. See the bundled
[LICENSE](LICENSE) file for details.
