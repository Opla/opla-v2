# opla-front

[![Build
Status](https://travis-ci.org/Opla/front.svg?branch=master)](https://travis-ci.org/Opla/front)

Opla.ai Frontend using Node es7 react and redux.


## Getting started

### Prerequisites

First of all, make sure you have [Node 8.x](https://nodejs.org/en/download/) and
[Yarn](https://yarnpkg.com/en/docs/install) installed.

This project requires a backend application to start. At the moment, you have to
install this [backend application](https://github.com/Opla/backend) by yourself.
In the following, we assume this backend application runs locally and is
available at: `127.0.0.1:8081`.

### Installation

1. Install the (dev) dependencies:

    ```
    $ yarn install
    ```

2. Register a new client application on the backend application in order to
   obtain client ID/secret and allow authentication:

    ```
    $ curl -H "Content-Type: application/json" -X POST \
        -d '{ "name": "Your Client Name", "email": "hello@example.org", "grant_type": "password", "redirect_uri": "http://127.0.0.1:8080" }' \
        http://127.0.0.1:8081/auth/application
    ```

You should receive a response with credentials that will be needed in the next
step.

3. Create a configuration file named `config/default.json` with the following
   content:

    ``` json
   {
        "backend": {
            "api": {
                "host": "127.0.0.1",
                "port": "8081",
                "path": "api/v1/"
            },
            "auth": {
                "clientId": "<YOUR CLIENT ID>",
                "clientSecret": "<YOUR CLIENT SECRET>",
                "host": "127.0.0.1",
                "port": "8081",
                "path": "auth/"
            },
            "secure": false
        }
    }
    ```

4. Start the dev environment:

    ```
    $ yarn dev
    ```

This application should be available at: http://127.0.0.1:8080/.


## Contributing

Please, see the [CONTRIBUTING](CONTRIBUTING.md) file.


## Contributor Code of Conduct

Please note that this project is released with a [Contributor Code of
Conduct](http://contributor-covenant.org/). By participating in this project you
agree to abide by its terms. See [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file.


## License

opla-front is released under the GPL v2.0+ License. See the bundled
[LICENSE](LICENSE) file for details.
