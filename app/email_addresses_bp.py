import os
import requests

worker_url = os.environ.get('WORKER_URL')

def add_email_to_db(email_address):
    requests.post(worker_url + '/email', email_address)

if __name__ == '__main__':
  add_email_to_db()