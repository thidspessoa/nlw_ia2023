//Recupera os dados do front-end, que serão inseridos no formulário

import { server } from "./server.js";

function recebeSubmit () {

    const form = document.getElementById('form');
    const input = document.getElementById('url'); 
    const content = document.getElementById('content'); 

    form.addEventListener('submit', async () => { 
    
        event.preventDefault(); 
        
        const videoURL = input.value; 

        if (!videoURL.includes('shorts')) { 
            window.alert('Error, format not suported :/');
            return content.textContent = 'Esse vídeo não parece ser do formato permitido. Escolha outro vídeo e tente novamente!';
        };
        
        //pegar somente o ID do vídeo
        const [_, params] = videoURL.split('/shorts/');

        const [videoID] = params.split('?si');

        content.textContent = 'Obtendo o texto do áudio...'

        const transcription = await server.get('/summary/' + videoID) 

        content.textContent = 'Realizando o resumo...';

        const summary = await server.post("/summary", {
            text: transcription.data.result,
        })  
        content.textContent = summary.data.result;
    })
};
recebeSubmit();