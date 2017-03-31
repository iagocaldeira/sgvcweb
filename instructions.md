# Instruções de como usar uma API RESTful

### URL base: 

    https://sgvcweb.herokuapp.com/

São utilizadas 2 formas de URL:

    https://sgvcweb.herokuapp.com/model

e

    https://sgvcweb.herokuapp.com/model/id

# Models

## Driver:
    attributes: {
    
        name : { type: 'string' },
    
        plate : { type: 'string' },
    
        city : { type: 'string' },
    
        // pode fingir que não existe, serve apenas para criar a relação e mostrar na pesquisa
        trackActions : {
        	collection: 'trackAction',
        	via: 'driver'
        }
    
      }

## TrackAction
     attributes: {
        
        position : { type: 'string' },
    
        time : { type: 'string' },
        
        isStart : { type: 'boolean' },
        
        isEnd : { type: 'boolean' },
    
        driver : {  model: 'driver'} // id do motorista
      }


# Como utilizar a API RESTful:

### Existem 4 formas de se fazer chamadas RESTful(GET|POST|PUT|DELETE)

## GET(Consultar): 
https://sgvcweb.herokuapp.com/driver
Retorna TODOS os motoristas cadastrados
https://sgvcweb.herokuapp.com/driver/1
Retorna o motorista de id: 1

## POST(Criar): 
https://sgvcweb.herokuapp.com/driver
Dentro da requisição é necessário passar os parametros do model, Exemplo:

    {
        name : 'José da Silva',
    
        plate : 'AAA-0000',
    
        city : 'Belo Horizonte'
    }

#### Forma alternativa (Lembre-se de dar encode nos atributos):

    https://sgvcweb.herokuapp.com/driver/create?name=joe&plate=AAA-0000&city=Belo Horizonte

## PUT(Alterar)
https://sgvcweb.herokuapp.com/driver/0
Dentro da requisição é necessário somente os parametros do model que serão alterados do motorista de id:0, Exemplo:

    {
        name : 'João Pedro',
    
        plate : 'AAA-0001',
    
        city : 'Nova Lima',
    }

#### Forma alternativa (Lembre-se de dar encode nos atributos):

    https://sgvcweb.herokuapp.com/driver/update/0?name=joe&plate=AAA-0000&city=Belo Horizonte

## DELETE(Remover)
https://sgvcweb.herokuapp.com/driver/0
Remove o motorista de id:0
