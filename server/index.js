//Arquivo que excuta o servidor
import cors from 'cors';
import express from 'express';

//Estamos dizendo que queremos importar a bibliteca cors e seu lugar de origem
import { convert } from './convert.js'; //importando o convert
import { download } from './download.js'; //Importando função de download
import { transcribe } from './transcribe.js'; //Função responsável pela descrição
import { summarize } from './summarize.js'; //Função responsável pelo resumo

const app = express(); //Inicializamos a biblioteca express dentro desta variavel
app.use(express.json());//Fizemos isso para ele conseguir entender que vamos receber também conteudo no formato json no metodo post
app.use(cors()); 

//Definimos para ele recuperar o ID dos videos abaixo na função get
//Quando tem : e um nome, ele já vai entender que id(ou qualquer nome) é um parametro
app.get("/summary/:id", async (request, response) => { //Summary é a rota
    try{
        await download(request.params.id); //donwload do video, aguarda a promessa ser atendida
        //Para definir que essa será uma função assincrona, precisamos também ter definido que donwload em seu arquivo seja assincrono também

        const audioConverted = await convert();  //Pega o resultado da função convert 

        
        console.log(audioConverted); //Conteudo que precisamos para passar para a I.A (Olhando na documentação o formato que a IA precisa para receber o audio)

        //Após terminar de fazer o download ele vai exeibir o resumo
        const result = await transcribe(audioConverted); //Armazena o resultado que está sendo importasdo de transcribe.js
        //Passa o audio convertido para a transcrição


        //Quando temos um cenario em que o nome da propiedade é o mesmo nome da variavel que está atribuindo valor, podemos deixar somente um dos nomes que ele irá entender 
        return response.json({ result }); //Ao utilizar o json, ele já irá devolver como objeto e lá no front end conseguimos recuperar o conteudo desta propiedade
    } catch(error) {
        console.log(error);
        return response.json({ error }); //
    }
}) //Aqui dizemos qual a ação que queremos receber uma solicitação
//Também executa uma função, que recebe request parametro que contem todas as informações da requisição
//Que foi feita pelo servidor.

//Response usamos para devolver uma resposta para quem fez a solicitação
//Metodo send devolve uma resposta
//Dentro do parenteses estamos dizendo que queremos recuperar de dentro da requisição, o parametro recuperando i id

app.post("/summary", async (request, response) => { //Aqui ao invez de completar o endereço como no metodo acima '/:id' utilizamos
    try {
        //Aqui a nossa rota vai passar o texto, para o nosso metodo de resumo para ele poder realizar o resumo;
        const result = await summarize(request.body.text); //Aqui passamos para a função o texto, mas dessa vez pegando do corpo da função
        //Dentro do nosso body vamos receber conteudos .json
        return response.json({ result }) //Devolvemos o resultado
    } catch(error) {
        console.log(error);
        return response.json({ error }); //
    }
})


app.listen(3333, () => console.log('Server is running on port 3333')) //Inicializa o servidor, listen escuta as requisições e entre parenteses está a porta
//Após a porta, ele executa uma função quando iniciar o servidor