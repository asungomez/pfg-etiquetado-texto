FROM python:3.8

RUN \
  apt-get update && \
  curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get -yqq install nodejs && \
  pip install -U pip && pip install pipenv && \
  pip install --no-cache-dir awscli && \
  npm i -g npm@7.21.0 && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /deployment

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN npm i -g serverless@2.55.0

RUN \
  npm install -g serverless-python-requirements@5.1.0 && \
  npm install -g serverless-wsgi@2.0.1

COPY libs /deployment/libs
COPY main.py /deployment/main.py
COPY config.yml /deployment/config.yml

ENTRYPOINT ["python3", "main.py"]