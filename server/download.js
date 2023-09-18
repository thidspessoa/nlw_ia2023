//Importando bibliotecas

import ytdl from 'ytdl-core'
import fs from 'fs' //Biblioteca built-in do node js
import { rejects } from 'assert';


//A gente colocou a função de download dentro de uma promisse. A função de download é dividida em etapas
export const download = (videoId) => new Promise((resolve, reject ) => {
    const videoURL = `https://www.youtube.com/shorts/${videoId}` //Padrão de URL do video shorts do youtube
    
    ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
        .on("info", (info) => { 
            const seconds = info.formats[0].approxDurationsMs / 1000; 

            if(seconds > 60) {
                throw new Error('A duração desse video é maior que 60 segundos.'); 
            }
            
        
        })
        .on("end", () => { 
            console.log('Download do video finalizado.');
            resolve() 
        })
        .on("error", (error) => {
            console.log(`Não foi possível fazer o download do vídeo. Detalhes do erro:${error}`);
            reject(error);
        
        })
        .pipe(fs.createWriteStream("./tmp/audio.mp4"))
})
