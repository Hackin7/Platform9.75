FROM ubuntu:18.04

# set a directory for the app
WORKDIR /usr/src/app
#COPY . .

#Testing
#RUN mkdir test && cd test && touch test.py
#RUN pwd
#RUN ls


RUN apt-get update
RUN apt-get install -y --no-install-recommends wget unzip
RUN wget --no-check-certificate https://github.com/Hackin7/Platform9.75/archive/master.zip
RUN unzip master.zip
#RUN git clone https://github.com/Hackin7/Platform9.75.git
#RUN ls

RUN apt-get install -y --no-install-recommends nodejs npm mongodb
RUN service mongodb start

RUN cd Platform9.75-master/client && touch .env.development.local && echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local

RUN apt-get install -y --no-install-recommends python3 python3-pip 
RUN pip3 install flask pymongo sendgrid
RUN cd /usr/src/app/Platform9.75-master/server && echo "export SENDGRID_API_KEY='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'" > sendgrid.env && echo "sendgrid.env" >> .gitignore 
#&& source ./sendgrid.env

#RUN cd Platform9.75-master/client && set NODE_TLS_REJECT_UNAUTHORIZED=0 &&\
#    $NODE_TLS_REJECT_UNAUTHORIZED && npm install



EXPOSE 80 5000
#ENTRYPOINT echo "hi"
CMD ["./Platform9.75-master/run.sh", "-f"]
