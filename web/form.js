import { server } from "./server.js";

function recebeSubmit () {

    //Recuperar os dados do formulário
    const form = document.getElementById('form');
    const input = document.getElementById('url'); //Recupera o input com URL
    const content = document.getElementById('content'); //Recupera o paragrafo

    // Ouvinte de evento, para registrar quando ocorrer o submit dos dados do formulário
    // Recebe dois parametros, o primeiro é o evento que o ouvinte irá registrar
    // o segundo é a função que deve ocorrer quando o ouvinte registrar o evento
    form.addEventListener('submit', async (event) => { //async aqui diz que essa função torna-se assincrona
        //Por padrão, quando ocorre o evento de submit ele recarrega a página
        //E acaba perdendo a informação,
        
        content.classList.add('placeholder');  //para a classe poder iniciar normalmente

        
        
        event.preventDefault(); // para evitar é preciso previnir o comportamento padrão
        
        const videoURL = input.value; 
    
        //Validação para saber se o vídeo é um shorts
        if (!videoURL.includes('shorts')) { //Metodo includes verifica se algo existe dentro da string
            window.alert('Error, format not suported :/');
            return (content.textContent = 'Esse vídeo não parece ser do formato permitido. Escolha outro vídeo e tente novamente!');
        };
        
        //pegar somente o ID do vídeo
        const [_, params] = videoURL.split('/shorts/'); //Split divide o texto por um caracter delimititador
        //Acima ele divide a URL em duas, formando um array. A da esqueda na posição 0 e a direita na posição 1
        //Utilizei um destructuring para salvar cada parte em uma variável
        //A primeira variavel é na verdade um caracter que indica que não quero salvar a primeira parte '_'

        //As vezes pode retornar além do ID do vídeo outras informações;
        const [videoID] = params.split('?si'); //Aqui conseguimos limpar a URL deixando somente o id
        //Quando queremos pegar somente a primeira posiçáo do array, não precisa colocar a vírgula e a outra variável


        content.textContent = 'Obtendo o texto do áudio...'

        //Primeira requisição que passa o ID do vídeo e retorna a transcrição do audio
        const transcription = await server.get('/summary/' + videoID) //Função assincrona pois é com o back end, e precisamos garantir que o código aguarde para executar os próximos passos. Utilizando o AWAIT ele sabe que precisa aguarda essa etapa terminar para prosseguir 
        //No servidor temos uma rota summary que recebe o id do video
    
        //Proxima etapa será mostrada no front-end
        content.textContent = 'Realizando o resumo...'; //Quando o back-end retorna a resposta, ele guarda o conteudo dentro de data, e estamos retornando o result de lá de dentro 
        // console.log(transcription.data.result)


        //Segunda requisição para a rota abaixo utilizando o metodo post e enviando no corpo da requisição
        //Atraves da propiedade text, enviando o resultado da transcrição
        const summary = await server.post("/summary", {
            text: transcription.data.result,
        }) //Agora vamos fazer o envio pelo corpo da requisição
        //Define um objeto com um parametro text, que foi denifido no const result do metodo post
    
        content.textContent = summary.data.result; //exibi a transcrição do video
        content.classList.remove('placeholder') //Remove esssa classe que altera a cor e impede de tocar no conteudo
    })
};

recebeSubmit();