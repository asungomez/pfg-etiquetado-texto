FROM python:3.8

RUN \
  echo "deb https://deb.nodesource.com/node_12.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
  wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  apt-get update && \
  apt-get install -yqq nodejs && \
  pip install -U pip && pip install pipenv && \
  pip install --no-cache-dir awscli && \
  npm i -g npm@^6 && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /deployment

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN npm i -g serverless@2.53.1

COPY libs /deployment/libs
COPY main.py /deployment/main.py

ENTRYPOINT ["python3", "main.py"]