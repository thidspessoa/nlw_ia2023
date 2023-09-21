import { pipeline  } from "@xenova/transformers";;
import { summaryExample} from "./utils/summary.js"; //Com o cursor dentro das chaves, segurando CNTRL + SPACE o vs code sugere o objeto

export async function summarize(text){ //Recebe o texto(descrição), e utiliza para fazer o resumo
    try {
        // return summaryExample;
        console.log('Realizando o resumo')

        const generator = await pipeline(
            'summarization',
            'Xenova/distilbart-cnn-12-6'
            ) //Aqui solicitamos o resumo ao modelo selecionado

        const output =  await generator(text) //saida, passamos como parametro o texto que a função recebe, para a IA fazer o resumo

        console.log('Resumo concluido com sucesso!')
        return output[0].summary_text //Sabendo que ele retorna um array, quero pegar especificamente esse indice com essa propiedade

    } catch (error) {
        console.log('Não foi possível realizar o resumo :/', error);
        throw new Error(error); //lança o erro para frente
    }
}