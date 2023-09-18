import axios from 'axios';

//Cria a configuração do nosso axios
export const server = axios.create({
    baseURL: "http://localhost:3333", //A parte do endereço que vai se repetir para todas as requisições, endereço do nosso servidor
    //Toda vez que quiser fazer uma requisição não vou precisar repetir o endereço pois já estara inserido nas requisições
})