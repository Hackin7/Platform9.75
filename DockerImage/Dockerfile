FROM ubuntu:18.04

# set a directory for the app
WORKDIR /usr/src/app
#COPY . .

#Testing
#RUN mkdir test && cd test && touch test.py
#RUN pwd
#RUN ls


RUN apt-get update
RUN apt-get install -y --no-install-recommends nodejs npm mongodb
RUN apt-get install -y --no-install-recommends python3 python3-pip 
RUN pip3 install flask pymongo sendgrid dnspython
RUN service mongodb start


# Get Application
RUN apt-get install -y --no-install-recommends wget unzip
RUN wget --no-check-certificate https://github.com/Hackin7/Platform9.75/archive/master.zip
RUN unzip master.zip
COPY ./keys.py /usr/src/app/Platform9.75-master/server/
RUN cd Platform9.75-master/client && touch .env.development.local && echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local
RUN cd Platform9.75-master/client && set NODE_TLS_REJECT_UNAUTHORIZED=0 &&\
    echo $NODE_TLS_REJECT_UNAUTHORIZED && npm install


COPY ./run.sh  ./Platform9.75-master/
RUN chmod +x Platform9.75-master/run.sh

EXPOSE 80 
#5000
#ENTRYPOINT echo "hi"
CMD cd Platform9.75-master && ./run.sh
#cd client && npm start & cd /usr/src/app/Platform-9.75-master/server && python3 main.py && pkill react-scripts
#["./Platform9.75-master/run.sh"]
