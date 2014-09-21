import requests
import urllib
import json
from bs4 import BeautifulSoup

def wolfram_math(entities, client):
    print "entities"
    print entities
    expression = (entities.get('wolfram_search_query') or
            entities.get('math_expression'))
    if (not isinstance(expression, dict)):
        expression = expression[0]
    expression = expression.get('value')

    wolfram_url = 'http://api.wolframalpha.com/v2/query?appid=HJ95HE-4J53RPLY6T&input='
    return_format = '&format=plaintext'
    answer = requests.get(wolfram_url + urllib.quote(expression) + return_format)
    soup = BeautifulSoup(answer.text)
    print soup
    try:
        el = (soup.queryresult.find_all('pod', id="Result")
                or soup.queryresult.find_all('pod'))[0]
        answer = el.find('plaintext').getText()
    except:
        try:
            answer = soup.queryresult.find_all('pod', title='Exact result')[0].find(
                'plaintext').getText()
        except:
            try:
                answer = soup.queryresult.find_all('pod')[1].find(
                        'plaintext').getText()
            except:
                return "Sorry, I didn't catch that"
    return answer
