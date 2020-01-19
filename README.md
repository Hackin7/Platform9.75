# Platform 9.75
A Peer Mentoring System. Users can choose tasks given by mentors, and get their guidance in achieving the task. Students can learn how to do things (such as code), while mentors can get the help they need!

Made for the NTU SCSE Challenge 2020 by BLITZ from Nanyang Junior College. ([Chan Zun Mun Terence](https://github.com/Hackin7), [Ian Pua](https://github.com/bobjohnjones), [Soh Ze Kai](https://github.com/undefined-func), Lucas Lim, Branda Ang)
## Technical Details
1. This is a React-Flask App.
2. It uses MongoDB as the Database
3. The sendGrid Email service would be used to send notifications to users
4. The file upload system involves the local file system

## Installation
```
#Use your package manager
sudo apt-get install -y nodejs npm mongodb python3 python3-pip 
pip3 install flask pymongo sendgrid dnspython
cd client
npm install
```

## Running
To run client side code
```
cd client
npm install react-scripts
sudo npm start #sudo to run on port 80
```
To run server side code
``` 
sudo service mongodb start
cd server
python3 main.py
```
To use the APIs, put in the mongoDB URI and sendGrid(for Email Service)API Key in `server/keys_TEMPLATE.py` and rename it to `server/keys.py`

## Deployment
`.env.development.local` has disabled host checking, so make sure to change that for actual deployment. Its already done in the docker file though

### Docker
Make sure to put in the API Keys in `DockerImage/keys_TEMPLATE.py` and rename it to `DockerImage/keys.py`
```
sudo docker build DockerImage
sudo docker run <containerID>
```
### Deploying on Heroku (Using Docker)
Check [here](https://devcenter.heroku.com/articles/container-registry-and-runtime#testing-an-image-locally]) for more help
```
cd DockerImage
sudo heroku container:push -a <appName>
sudo heroku container:release web -a <appName>
```
You can put in mLab MongoDB free tier Database, along with sendGrid (free), to host this service for free.
However, the file upload system would be such that the files uploaded only last for a certain short period of a time, max 24 hours.