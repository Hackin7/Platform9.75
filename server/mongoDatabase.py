#!/usr/bin/env python

#https://www.w3schools.com/python/python_mongodb_getstarted.asp
import pymongo

import random
#https://pynative.com/python-generate-random-string/
import string
def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))
    

class Database:
    def __init__(self, link="mongodb://localhost:27017/"):
        #Put your stuff inside a key.txt
        print("Connecting to",link)
        self.client = pymongo.MongoClient(link)
        #Creates if doesn't exist
        self.name = "platform9_75"
        self.database = self.client[self.name]
        self.accounts = self.database["accounts"]
        self.userdata = self.database["user-data"]
        self.chats = self.database["chats"]
        self.tasks = self.database["tasks"]
        
        #self.ids = self.database["ids"]
        self.taskid = 0
        self.chatid = 0
        self.accountIDs = {}#{"1234":"lolcatz"}
    
    def incrementThingId(self,dataType):
        pass
    def getThingId(self,dataType):
        pass
        
    def debug(self):
        #print(self.accounts)
        print("######################################")
        print("Accounts")
        for i in self.accounts.find():print(i)
        print("IDs")
        print(self.accountIDs)
        #print(self.userData)
        print("UserData")
        for i in self.userdata.find():print(i)
        print("Chats")
        print(self.getChatData())
        print("Tasks")
        print(self.getTaskData())
        print("######################################")
        
        
    def remove(self):
        # To Remove a collection
        #self.accounts.drop()
        self.client.drop_database(self.name)
        print("Database Removed")        
    ###Account Management System#########################################
    def addAccount(self, name, password):
        #print("addAccount",name,password)
        if self.hasAccount(name): 
            return False
        #self.accounts[name] = password
        self.accounts.insert_one({"name":name, "password":password})
        
        # Create ID
        userID = randomString(10)
        while userID in self.accountIDs.keys():
            userID = randomString(10)
        self.accountIDs[userID] = name
        
        self.adduserdata(name)
        #self.userData[name] = []
        #self.userdata.insert_one({"name":name, "data":[]})
        return True
        
    def hasAccount(self, name):
        myquery = { "name": name }
        user = self.accounts.find(myquery)
        
        print("hasAccount",name,"=>",user.count())
        self.debug()
        return user.count()
        #return name in self.accounts.keys()
        
    def getPassword(self, name):
        myquery = { "name": name }
        password = self.accounts.find_one(myquery)["password"]
        return password        
    ###Local Storage################################
    def getIdFromName(self, name):
        key_list = list(self.accountIDs.keys()) 
        val_list = list(self.accountIDs.values()) 
        if name not in val_list:
            userID = randomString(10)
            while userID in self.accountIDs.keys():userID = randomString(10)
            self.accountIDs[userID] = name
            #return userID
        return key_list[val_list.index(name)]
    
    def getNameFromID(self, userid):
        try:
            return self.accountIDs[userid]
        except:
            return ""
    #################################################
    ####################################################################
    
    ###Add#################################
    def adduserdata(self, name):
        print("$$$$$$$$$$ADDING USER DATA",name)
        self.userdata.insert_one({"name":name, "chatids":[], "mentoringTaskIds":[], "mentoringChatIds":[]})

    def addtask(self, name, description, mentors=[]):
        thetask = self.tasks.insert_one({'_id': str(self.taskid), 'name': name, "description": description, "mentors":mentors})
        ###Put under mentor's guidance#######################################################
        for i in mentors:
            self.updateuserdata(i,{"mentoringTaskIds":str(self.taskid)},"$push")
        self.taskid+=1

    def addchat(self, name, taskid):
        mentors = self.getTaskData({"_id":taskid})[0]["mentors"]
        #print("$$$$$$$$$$$$$$$$$$$$Mentors",mentors)

        self.chats.insert_one({ "_id":str(self.chatid), "taskid": taskid ,"students":[name],"mentors":mentors,"chats":[], "state":0})
        prevId=str(self.chatid)
        self.chatid += 1
        ###Insert in UserData###############################################################
        userData = self.getUserData({"name":name})
        print(userData)
        userData["chatids"] += [prevId]
        self.updateuserdata(name,{"chatids":userData["chatids"]})
        ###Put under mentor's guidance#######################################################
        for i in mentors:
            self.updateuserdata(i,{"mentoringChatIds":str(prevId)},"$push")
        return prevId
        
    ###Get#################################
    def getUserData(self,query={}):
        getuser = self.userdata.find_one(query)
        return getuser

    def getTaskData(self,query={}):
        tasksdata = self.tasks.find(query)
        data = []
        for i in tasksdata:
            data.append(i)
        return data
        
    ###Managing
    def getTasksToManage(self, name):
        query = { "mentors": { "$all": [name] } }
        return self.getTaskData(query)
        
    def getChatsToManage(self, name):
        query = { "mentors": { "$all": [name] } }
        return self.getChatData(query)
    
    def getTaskChatsToManage(self, name):
        query = { "mentors": { "$all": [name] } }
        return self.getTaskChatData(query)
    ###########
    def getChatData(self,query={}):
        chatsdata = self.chats.find(query)
        
        data = []
        for i in chatsdata:
            data.append(i)
        print(data)
        return data
    
    def getTaskChatData(self,query={}): #Merge things together
        chatsdata = self.chats.find(query)
        
        data = []
        for i in chatsdata:
            data.append(i)
            data[-1]["_id"] = str(data[-1]["_id"])
            task = self.tasks.find_one({"_id":i["taskid"]})
            data[-1]["taskInfo"] = task
        print(data)
        return data
    ###Update#################################
    def updateuserdata(self, name, update, method="$set"):
        self.userdata.update({"name":name},{method: update})

    def updatechat(self, _id, update, method="$set"):
        self.chats.update_one({"_id": _id},{method:update})
        return self.getChatData({"_id":_id})

    def updatetask(self, _id, update, method="$set"):
        self.tasks.update_one({'_id':_id},{method:update})
        return self.getTaskData({"_id":_id})

    ###Remove#################################
    def removetask(self, _id):
        self.tasks.delete_one({"_id":_id})
        self.chats.delete_many({"taskid":_id})
        ###TODO, Remove id of chat from userdata


if __name__ == '__main__':
    stuff = input("Enter 'remove' to reset database: ")
    if stuff == "remove":
        db = Database()
        db.remove()
    else:
        print("Database not removed")
    stuff = input("Enter 'drive' to run driver code: ")
    if stuff=="drive":
        print("driving")
        #import mongoDatabase as mdb
        db = Database()
        db.remove()
        db = Database()
        db.addAccount("lolcatz","shit")
        db.addAccount("admin","shit")
        db.addtask("Hello","World",["admin"])
        db.debug()
        db.addchat("lolcatz","0")
        print(db.getChatData())
        db.updatechat("0",{"chats":{"text":"This is a test","name":"lolcatz","dateTime":"UTC 16/1/2020 15:29:42"}},"$push")
        db.debug()
