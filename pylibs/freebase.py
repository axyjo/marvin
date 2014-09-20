import requests
import json
import urllib

def person_search(entities, client):
    name_search_url = 'https://www.googleapis.com/freebase/v1/search?query='
    entity_dict = entities.get('entity')
    if (not isinstance(entity_dict, dict)):
        entity_dict = entity_dict[0]

    name_search = requests.get(name_search_url + entity_dict.get('value'))
    name = name_search.json().get('result')[0].get('id')
    info = requests.get('https://www.googleapis.com/freebase/v1/topic' +
            name + '?filter=/common/topic/article')
    info_dict = json.loads(info.text)
    value = info_dict.get('property').get('/common/topic/article').get(
            'values')[0].get('property').get('/common/document/text').get(
            'values')[0].get('value')
    if client == 'web':
        return info_dict
    elif client in ['text', 'voice']:
        values = value.split('. ')
        return '. '.join(values[:2]).strip() + '.'
