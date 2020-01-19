#Platform 9.75

To run client side code
```
cd client
npm install react-scripts
sudo npm start #sudo to run on port 80
```
To run server side code
``` 
cd server
python3 main.py
```
To deploy to EC2, make sure to check out 
https://github.com/facebook/create-react-app/pull/2288

`.env.development.local` has disabled host checking, so make sure to change that for actual deployment