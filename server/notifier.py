#!/usr/bin/env python

# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
# Check https://app.sendgrid.com/guide/integrate/langs/python for API Key
import os
import keys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
'''
with open("sendgrid.env") as key:
    apikey=key.read().split("'")[1]
    print("API Key:",apikey)
'''
apikey = keys.SENDGRID_API_KEY
sg = SendGridAPIClient(apikey)#apiKeyos.environ.get('SENDGRID_API_KEY'))

def notify(fromEmail,toEmail,subject,content):
    print("Notifying", fromEmail, toEmail)
    message = Mail(
        from_email="platform9.75@email.com",#fromEmail,
        to_emails=toEmail,
        subject=subject,
        html_content=content)
    try:
        #sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        print("Sending")
        response = sg.send(message)
        print("###Response###################################")
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print("Error:",e)

if __name__ == '__main__':
    pass
