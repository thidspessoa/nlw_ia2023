import fs from 'fs'; //Manipular o arquivo
import wav from 'node-wav'; //Converter para o formato wav
import ffmpeg from 'fluent-ffmpeg' //manipular o áudio
import ffmpegStatic from 'ffmpeg-static' //apontar qual biblioteca vamos utilizar do ffmpeg

const filePath = "./tmp/audio.mp4"; //diz aonde estou salvando o arquivo da maniuplação, pois como vamos reutilizar varias vezes podemos reutilizar assim
//tambem facilita se caso depois quisermos alterar o endereço, basta vir e alterar em um único lugar
const outputPath = filePath.replace('.mp4', '.wav'); //Onde vou salvar o arquivo convertido


export const convert = () => new Promise ((resolve, reject) => {
    console.log('Converting video...'); //para quando começar a converter

    ffmpeg.setFfmpegPath(ffmpegStatic); //Passamos o ffmpegstatic para conseguir utiliza-lo

    ffmpeg()
    .input(filePath)//aqui dizemos onde está o arquivo que queremos manipular
    .audioFrequency(16000) //frequencia de audio
    .audioChannels(1) //diz que nosso audio vai ter um canal, pois ele vai retornar uma lista e vamos conseguir pegar o audio na primeira posição do vetor
    .format('wav') //format
    .on('end', () => { //quando terminar de fazer a conversão
        const file = fs.readFileSync(outputPath); //pega o arquivo já .wav
        const fileDecoded = wav.decode(file); //decodifica o arquivo com wav decoded, que é pegar o audio e transformalo em código

        const audioData = fileDecoded.channelData[0];//agora estamos pegando somente o audio
        const floatArray = new Float32Array(audioData);

        console.log('Video convertido com sucesso');

        resolve(floatArray);
        fs.unlinkSync(outputPath); //Como não quero que o arquivo fique nesta pasta, falo para ele deletar o arquivo
        

    })
    .on('error', (error) => {
        console.log('Erro ao converter o vídeo', error)
        reject(error) //rejeita a promessa exibindo o erro
    })
    .save(outputPath) //salva o arquivo
})