FROM python:3

ARG PL_FOLDER=./
ENV PL_HOME=/usr/src/app

WORKDIR ${PL_HOME}

COPY ${PL_FOLDER}/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ${PL_FOLDER} .
RUN rm -f CONTAINER_ALREADY_STARTED_PLACEHOLDER

RUN mkdir -p home/Yggdrasil \
  && mkdir -p media

ADD             ./docker-start.sh /opt/sh/
RUN             chmod +x /opt/sh/docker-start.sh
ENTRYPOINT      ["/opt/sh/docker-start.sh"]
