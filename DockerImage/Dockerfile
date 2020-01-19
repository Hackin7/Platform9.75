FROM ubuntu:18.04

# set a directory for the app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends wget unzip nodejs npm mongodb python3 python3-pip &&\
    pip3 install flask pymongo sendgrid dnspython &&\
    service mongodb start
    
# Get Application
ARG CACHE_DATE=2018-01-01 
#Update the date to refresh
RUN wget --no-check-certificate https://github.com/Hackin7/Platform9.75/archive/master.zip && unzip master.zip &&\
    cd Platform9.75-master/client && touch .env.development.local && echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local
RUN cd Platform9.75-master/client && set NODE_TLS_REJECT_UNAUTHORIZED=0 &&\
    echo $NODE_TLS_REJECT_UNAUTHORIZED && npm install

COPY ./keys.py ./Platform9.75-master/server
#RUN cd ./Platform9.75-master/server && cat keys.py
COPY ./run.sh  ./Platform9.75-master/
RUN chmod +x Platform9.75-master/run.sh

EXPOSE 3000
#5000
#ENTRYPOINT echo "hi"
CMD cd Platform9.75-master &&  ./run.sh
