import requests

def zen(entities, client):
    zen_url = 'https://api.github.com/zen'
    request = requests.get(zen_url)

    return request.text
