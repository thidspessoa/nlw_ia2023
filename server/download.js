//Importando bibliotecas

import ytdl from 'ytdl-core'
import fs from 'fs' //Biblioteca built-in do node js
import { rejects } from 'assert';


//A gente colocou a função de download dentro de uma promisse. A função de download é dividida em etapas
export const download = (videoId) => new Promise((resolve, reject ) => {
    const videoURL = `https://www.youtube.com/shorts/${videoId}` //Padrão de URL do video shorts do youtube
    //Utilizamos assim para poder tratar o caso de o url que o usuario inseriu no front, vir com algum parametro (ex: ? e etc)
    //Isso se fossemos pegar diretamente a url que recebe no front
    
    ytdl(videoURL, { quality: "lowestaudio", filter: "audioonly" })
        .on("info", (info) => { //Etapa de pegar informação
            //Passa como parametro o URL do video e um objeto de configuração de como o video deve ser baixado
            //Quality especifica a qualidade do video, passamos com qualidade de audio baixo para o video ficar mais leve e a I.A conseguir entender numa boa
            //Filter diz do que queremos baixar especificamente, e lá especificamos que queremos baixar somente o audio
            //o arquivo já vem como .mp4 e agora especificamos que só irá vir o audio
    
            //Com o ON é possível acompanhar as etapas do processo de download do vídeo
            //Utilizamos o metodo info, que recupera informações do video, passamos uma arrow function com um parametro que irá armazenar essas informações

            
            
            
            //Validação para saber se o video é um shorts ou não
            const seconds = info.formats[0].approxDurationsMs / 1000; //Devolve a duração do video em mili segundos, e convertemos em segundos fazendo a divisão
        
            //Verificação
            if(seconds > 60) {
                throw new Error('A duração desse video é maior que 60 segundos.'); //Lançamento de um novo erro, estamos fazendo um erro propositalmente;
                //Throw == Lançar
            }
            
        
        })
        .on("end", () => { //Etapa de fazer o download do video
            //Quado o video acabar
            console.log('Download do video finalizado.');
            resolve() //Donwload terminou //Resolve do promisse
        })
        .on("error", (error) => {//caso ocorra algum erro, poderemos saber o porque
            console.log(`Não foi possível fazer o download do vídeo. Detalhes do erro:${error}`);
            reject(error); //Reject do promisse
        
        })
        .pipe(fs.createWriteStream("./tmp/audio.mp4")) //pipe é a etapa de recuperar a iformação(conteudo do video) e salvar. O FS é utilizado para manipular os arquivos
        //createWriteStream permite pegar o conteudo do vídeo e escrever em um arquivo e salvar


    

})
//Exportando a função para poder utilizar em outro lugar do projeto
