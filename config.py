from google.auth.transport import requests
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file('key.json')
scoped_credentials = credentials.with_scopes(['https://www.googleapis.com/auth/cloud-platform'])

request = requests.Request()
scoped_credentials.refresh(request)

print(scoped_credentials.token)