from flask import Flask, render_template, request
app = Flask(__name__)
import json

@app.route('/')
def index():
    return "Invalid"
    
import random
#https://pynative.com/python-generate-random-string/
import string
def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

from mongoDatabase import Database
db = Database()

###Account Management###################################################
@app.route('/createaccount', methods=['POST'])
def createAccount():
    data = json.loads(request.data)
    name = data['name']
    password = data['password']
    #print("HHHHHHHHHHHHH")
    #print("Password:",password)
    valid = db.addAccount(name,password)
    db.adduserdata(name)
    return json.dumps({"valid":valid})
    
@app.route('/login', methods=['POST'])
def authentication():
    data = json.loads(request.data)
    name = data['name']
    password = data['password']
    userid=""
    valid=False
    try:
        if db.getPassword(name) == password:
            userid=db.getIdFromName(name)
            valid=True
    except:pass
    return json.dumps({"id":userid, "valid":valid})
    
@app.route('/authid', methods=['POST'])
def authenticationID():
    data = json.loads(request.data)
    name = data['name']
    userid = data['id']
    #print(request.data, name, password)
    password=""
    valid=False
    
    if db.getNameFromID(userid) == name:
        password=db.getPassword(name)
        valid=True
    return json.dumps({"password":password, "valid":valid})
    
###Data Management######################################################

###Get#################################################
@app.route('/retrieve/<dataType>', methods=['POST'])
def retrieve(dataType):
    ###Data Processing#####################
    data = json.loads(request.data)
    user = db.getNameFromID(data["userID"])
    query = data["query"]
    ########################################
    print("#################",data)

    #db.debug()
    
    if dataType=="tasks":
        data = db.getTaskData(query)
        '''
        data = [{"id":"12423",
                "name":"Do Your Homework",
                "description":"Stop failing your life and do something"},
                {"id":"ws",
                "name":"Do Your Life",
                "description":"Stop your life and die",}
        ]'''
    elif dataType=="chats":
        data = db.getChatData(query)
        '''
        data = [{"id":"123","taskid":"12423",
                "mentors":["12","123"],"students":[],
                "chats":["1","22","3","4"], "state":0}]
        '''
    elif dataType=="user":
        data = db.getUserData(query)
    elif dataType=="usertasks":
        data = db.getTaskChatData(query)
        '''
        data = [{"id":"0","mentors":["12","123"],"students":[],
                "taskid":"0","taskInfo":{"name":"Hello World",
                "description":"World"}, "state":0}]
        '''
    print("#############DATA###########",data)
    return json.dumps({"type":dataType,"data":data})


@app.route('/retrieve/managing/<dataType>', methods=['POST'])
def retrieveManaging(dataType):
    ###Data Processing#####################
    data = json.loads(request.data)
    user = db.getNameFromID(data["userID"])
    #query = data[""]
    ########################################
    
    if dataType=="tasks":
        data = db.getTasksToManage(user)
    elif dataType=="chats":
        data = db.getChatsToManage(user)
    elif dataType=="taskchats":
        data = db.getTaskChatsToManage(user)
        
    print("#############DATA###########",data)
    return json.dumps({"type":dataType,"data":data})
    
###Set#################################################

@app.route('/add/<dataType>', methods=['POST'])
def add(dataType):
    ###Data Processing#####################
    data = json.loads(request.data)
    user = db.getNameFromID(data["userID"])
    #userId = db.getUserData({"name":user})["_id"]
    
    getData = data["params"]
    print(data)
    #######################################
    
    if dataType=="task":
        name=getData["name"]
        description=getData["description"]
        db.addtask(name,description,[user])
    elif dataType=="chat":
        taskId=getData["taskId"]
        newChatId = db.addchat(user,taskId)
        return json.dumps({"newChatId":newChatId})
    return "OK"

@app.route('/update/<dataType>', methods=['POST'])
def update(dataType):
    ###Data Processing#####################
    data = json.loads(request.data)
    user = db.getNameFromID(data["userID"])

    thingId = data["thingId"]
    update = data["update"]
    try:
        method = data["method"]
    except:
        method = "$set"
    #######################################
    
    if dataType=="task":
        db.updatetask(thingId,update,method=method)
    elif dataType=="chat":
        print("##################################",update)
        data = db.updatechat(thingId,update,method=method)
        print(data)
        '''
        data = [{"id":"123","taskid":"12423",
                "mentors":["12","123"],"students":[],
                "chats":["1","22","3","4"], "state":0}]
        '''
        return json.dumps({"type":dataType,"data":data})
    elif dataType=="user":
        db.updateuserdata(thingId,update,method=method)
        
    db.debug()
    return "OK"
    
    
@app.route('/remove/<dataType>', methods=['POST'])
def remove(dataType):
    ###Data Processing#####################
    data = json.loads(request.data)
    user = db.getNameFromID(data["userID"])
    
    thingId = data["thingId"]
    ######################################

    if dataType=="task":
        db.removetask(thingId)
    db.debug()
    return "OK"
    
'''  
import sys
try:
    print(sys.argv[1])
    port = int(sys.argv[1])
except:port=5000
'''

if __name__ == '__main__':
    #port = int(os.environ.get('PORT'))
    app.run( debug=True, use_reloader=True)
#app.run()#debug=True, host='0.0.0.0')

