FROM ubuntu:18.04

# set a directory for the app
WORKDIR /usr/src/app
#COPY . .

#Testing
#RUN mkdir test && cd test && touch test.py
#RUN pwd
#RUN ls

RUN apt-get clean && mv /var/lib/apt/lists /tmp && mkdir -p /var/lib/apt/lists/partial && apt-get clean && apt-get update
RUN apt-get update
RUN apt-get install -y --no-install-recommends wget unzip nodejs npm mongodb python3 python3-pip && pip3 install flask pymongo sendgrid dnspython
#RUN service mongodb start

# Get Application
ARG CACHE_DATE=2016-01-01 
#Update the date to refresh
RUN wget --no-check-certificate https://github.com/Hackin7/Platform9.75/archive/master.zip && unzip master.zip
COPY ./keys.py /usr/src/app/Platform9.75-master/server/
COPY ./run.sh  ./Platform9.75-master/

RUN cd Platform9.75-master/client && touch .env.development.local && echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local &&\
    cd /usr/src/app && chmod +x Platform9.75-master/run.sh &&\
    cd Platform9.75-master/client && set NODE_TLS_REJECT_UNAUTHORIZED=0 &&\
    echo $NODE_TLS_REJECT_UNAUTHORIZED && npm install

COPY ./run.sh  ./Platform9.75-master/
EXPOSE 3000
#5000
#ENTRYPOINT echo "hi"
CMD cd Platform9.75-master && (cd client && npm start)& while true;do cd /usr/src/app/Platform9.75-master/server && python3 main.py || true;done
