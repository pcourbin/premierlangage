
# Use [PremierLangage](https://github.com/PremierLangage/premierlangage) in a Docker
This repository is a simple fork of the [PremierLangage](https://github.com/PremierLangage/premierlangage) great project to which a dockering procedure has simply been added.
You can quickly deploy:
 - A completely dockerized version of the project, especially for testing
 - A development environment using the docker containing all the necessary libraries.

Please, refer to the original [Github repository](https://github.com/PremierLangage/premierlangage) and the original [demo site](https://github.com/PremierLangage/premierlangage) for more details.

  * [Getting Started](#getting-started)
    + [Prerequisities](#prerequisities)
    + [Quickstart](#quickstart)
  * [Environment Variables](#environment-variables)
    + [`PL_ENV_TYPE` options](#-pl-env-type--options)
  * [Example : Run release version](#example---run-release-version)
  * [Example : Run development version](#example---run-development-version)

## Getting Started

### Prerequisities

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Quickstart
This docker image is based on [python:3](https://hub.docker.com/_/python).
It includes the packages needed to run [PremierLangage](https://github.com/PremierLangage/premierlangage) (Especially [Django](https://www.djangoproject.com/)). All the code for this repository is copied to the docker in the folder `/usr/src/app`.

To run a simple example, you can use the file `docker-compose.yml`
```
version: '3'
services:
  pl:
    image: pcourbin/pl:0.7.1
    environment:
      - PL_ENV_TYPE=local
      - DATABASE_HOST=pg
      - DATABASE_USERNAME=pl
      - DATABASE_PASSWORD=plpassword
      - ALLOWED_HOSTS=*
      - SECRET_KEY=mygreatsupersecretkey
    ports:
      - 8000:8000
    links:
      - pg

  pg:
    image: postgres
    environment:
      - POSTGRES_USER=pl
      - POSTGRES_PASSWORD=plpassword
      - POSTGRES_DB=django_premierlangage
```
and run
```
docker-compose up
```
Then, go to http://localhost:8000 and use super user credentials:
 - login: `admin`
 - password: `adminadmin`


## Environment Variables

| Name | Default | Possibles values |Description |
| --- | --- | --- |--- |
| `PL_ENV_TYPE` | `db`| `local`, `release`, `db` | See details below |
| `PL_STATIC_FILES` | `true` |`true`, `false`| Collect static files. See details in [Django documentation](https://docs.djangoproject.com/en/2.2/ref/contrib/staticfiles/)
|`DATABASE_HOST`|`127.0.0.1`|*|Host of the postgresql database|
|`DATABASE_PORT`|`5432`|*|Port of the postgresql database|
|`DATABASE_NAME`|`django_premierlangage`|*|Name of the postgresql database|
|`DATABASE_USERNAME`|`django`|*|Username of the postgresql database which has access to the `DATABASE_NAME` postgresql database|
|`DATABASE_PASSWORD`|`django_password`|*|Password of `DATABASE_USERNAME`|
|`SANDBOX_URL`|`http://127.0.0.1:7000/sandbox`|*|See specific Github repository of [PremierLangage Sandbox](https://github.com/PremierLangage/sandbox) for details.|
|`ALLOWED_HOSTS`|`127.0.0.1`|*|Configuration of the allowed hosts of Django. See details in [Django documentation](https://docs.djangoproject.com/en/2.2/ref/settings/#allowed-hosts)|
|`SECRET_KEY`|`defaultsecretkey`|*|Configuration of the secret key for a particular Django installation. See details in [Django documentation](https://docs.djangoproject.com/en/2.2/ref/settings/#std:setting-SECRET_KEY)|

### `PL_ENV_TYPE` options
| Value | Description | Users (login/password) |
| --- | --- | --- |
| `db` | Only deploy the docker without any database initialisation. (if you already have your own filled database). |  See your database. |
| `local` | Deploy a quick version with default user. `script\fill_database_local.py` is run at first startup. |  `admin`/`adminadmin` |
| `release` | Deploy a quick version without default. `script\fill_database_release.py` is run at first startup. |  Run `python3 manage.py createsuperuser` in your docker to create admin user. |

## Example : Run release version
To run a simple example, you can use the file `docker-compose.yml` and edit `PL_ENV_TYPE`to `release`
```
version: '3'
services:
  pl:
    image: pcourbin/pl:0.7.1
    environment:
      - PL_ENV_TYPE=release
      - DATABASE_HOST=pg
      - DATABASE_USERNAME=pl
      - DATABASE_PASSWORD=plpassword
      - ALLOWED_HOSTS=*
      - SECRET_KEY=mygreatsupersecretkey
    ports:
      - 8000:8000
    links:
      - pg

  pg:
    image: postgres
    environment:
      - POSTGRES_USER=pl
      - POSTGRES_PASSWORD=plpassword
      - POSTGRES_DB=django_premierlangage
```
then run
```
docker-compose up
```
next, you need to create an admin user with:
```
docker-compose exec pl python3 manage.py createsuperuser
```
Then, go to http://localhost:8000 and use your user credentials.

## Example : Run development version
To run a dockerized version of the environment but using your code as application :

 1. Run the script `docker-dev-prepare.sh`which will download some librairies with `pip`
 2. Use the file `docker-compose-dev.yml` which mount the current folder as the application folder `/usr/src/app`
 3. If needed, you can then create your own dockerized version using `docker-compose -f docker-compose-dev.yml build`
