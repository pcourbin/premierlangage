#!/bin/bash
#https://stackoverflow.com/questions/37836764/run-command-in-docker-container-only-on-the-first-start
if [ -z "$PL_ENV_TYPE" ]; then
  PL_ENV_TYPE_TEMP="db"
else
  PL_ENV_TYPE_TEMP=$PL_ENV_TYPE
fi

if [ -z "$PL_STATIC_FILES" ]; then
  PL_STATIC_FILES_TEMP="false"
else
  PL_STATIC_FILES_TEMP=$PL_STATIC_FILES
fi


prepare_static_files() {
    #Creating static files
    echo ""
    echo "Creating static files..."
    python3 manage.py collectstatic --noinput || { echo>&2 "ERROR: python3 manage.py collectstatic failed" ; exit 1; }
    echo "Done !"
}

prepare_local_env() {
    #Building database
    echo ""
    echo "Configuring database..."
    python3 manage.py makemigrations || { echo>&2 "ERROR: python3 manage.py makemigrations failed" ; exit 1; }
    python3 manage.py migrate || { echo>&2 "ERROR: python3 manage.py migrate failed" ; exit 1; }

    #Filling database
    python3 manage.py shell < script/fill_database_local.py || { echo>&2 "ERROR: python3 manage.py shell < script/fill_database_local.py failed" ; exit 1; }
    echo "Done !"
}

prepare_release_env() {
    #Creating static files
    prepare_static_files

    #Building database
    echo ""
    echo "Configuring database..."
    SECRET_KEY=$SECRET_KEY python3 manage.py makemigrations || { echo>&2 "ERROR: python3 manage.py makemigrations failed" ; exit 1; }
    SECRET_KEY=$SECRET_KEY python3 manage.py migrate || { echo>&2 "ERROR: python3 manage.py migrate failed" ; exit 1; }

    #Filling database
    SECRET_KEY=$SECRET_KEY python3 manage.py shell < script/fill_database_release.py || { echo>&2 "ERROR: python3 manage.py shell < script/fill_database_release.py failed" ; exit 1; }
    echo "Done !"
}

cd ${PL_HOME}

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    if [[ "$PL_ENV_TYPE_TEMP" == "local" ]]; then
        echo "**************************************"
        echo "******* RUN WITH INIT DB LOCAL *******"
        echo "**************************************"
        prepare_local_env
    elif [[ "$PL_ENV_TYPE_TEMP" == "release" ]]; then
          echo "**************************************"
          echo "****** RUN WITH INIT DB RELEASE ******"
          echo "**************************************"
          prepare_release_env
    else
          echo "**************************************"
          echo "**** RUN WITH DB ALREADY EXISTING ****"
          echo "**************************************"
    fi

    if [[ "$PL_STATIC_FILES_TEMP" == "true" ]]; then
        echo "**************************************"
        echo "******** STATIC FILES CREATED ********"
        echo "**************************************"
        prepare_static_files
    fi
else
    echo "-- Not first container startup. Delete file \"CONTAINER_ALREADY_STARTED_PLACEHOLDER\" if you want to run the initialization process. --"
fi

echo "-- Run Server --"
python3 manage.py runserver 0.0.0.0:8000
