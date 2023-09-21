//Função que faz a transcrição do audio
import { pipeline } from "@xenova/transformers";

import { transcriptionExample } from "./utils/transcription.js"; //Arquivo de exemplo de um video transcrito

//Aqui utilizamos estrutura de try cath
export async function transcribe(audio) {
  try {
    // return transcriptionExample

    console.log("Realizando a transicrição...")

    //Existem varios modelos no site hugginface
    const transcribe = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-small"
    )

    const transcription = await transcribe(audio, {//Aqui vamos usar o modelo, e preicisamos passar o audio entre parenteses
      chunk_length_s: 30, //Vai dividir o conteudo em pedacinhos
      stride_length_s: 5, //Sempre que utilizamos a pripiedade chuk precisamos usar o stride
      language: "portuguese", //Idioma
      task: "transcribe", //Aqui definimos a tarefa que ele vai realizar
    })

    console.log("Transcrição finalizada com sucesso.")
    return transcription?.text.replace("[Música]", "")//O retorno esperado pelo modelo é um texto, mas caso não venha a retornar isso a gente já coloca essa interrogação para não quebrar o programa
    //Quando um video tem trilha sonora ele colcoa desse jeito '['musica']', e como não queremos q isso apareça no texto
  } catch (error) {
    throw new Error(error)
  }
}
