import express from 'express';
import * as dotenv from 'dotenv';
import {growdevers} from './dados.js';
import {randomUUID} from 'crypto';
import { allowedNodeEnvironmentFlags} from 'process';
import { logMiddleware, validateGrowdeverMiddleware, logBody, validateGrowdeverMatriculadoMiddleware} from './middlewares.js';
import cors from 'cors';
import { METHODS } from 'http';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logMiddleware);
app.use(cors());


//CRIAR ROTA 
//GET /growdevers - Listar growdevers API
app.get('/growdevers', [logBody], (req, res) => {

    const {idade, nome, email} = req.query;

    let dados = growdevers;

    if(idade) {
        dados = dados.filter(item => item.idade >= Number(idade));
    }

    if(nome) {
        dados = dados.filter(item => item.nome.includes(nome));
    }

    if(email) {
        dados = dados.filter(item => item.email.includes(email));
    }
    
    res.status(200).send({
        ok: true,
        mensagem: "Growdevers listados com sucesso",
        dados: dados
    });
})

//POST /growdevers - Cadastrar growdever API
app.post('/growdevers', [logBody, validateGrowdeverMiddleware], (req, res) => {

    try {
    // 1ª etapa é a entrada de dados
    const body = req.body;

    const novoGrowdever = 
    {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        idade: body.idade,
        matriculado: body.matriculado
    }

    // 2º etapa é o processamento dos dados

    growdevers.push(novoGrowdever);

    // 3ª etapa é a saída dos dados

    res.status(201).send({
        ok: true,
        mensagem: "Growdever cadastrado com sucesso",
        dados: novoGrowdever,
    });


    } catch(error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }

    
});

//GET Obter por ID
app.get('/growdevers/:id', [logBody], (req, res) => {
    // 1ª etapa é a entrada de dados
    const {id} = req.params;
    // 2ª etapa é o processamento dos dados
    const growdever = growdevers.find((growdever) => growdever.id === id);
    if(!growdever) {
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado",
        });
        }   
        // 3ª etapa é a saída dos dados
        res.status(200).send({
            ok: true,
            mensagem: "Growdever encontrado com sucesso",
            dados: growdever,

            
        });
        
    });

//PUT atualizar growdever API
app.put('/growdevers/:id', [logBody, validateGrowdeverMiddleware, validateGrowdeverMatriculadoMiddleware], (req, res) => {
        
    const { id } = req.params;
    const { nome, email, idade, matriculado } = req.body;
  
    const growdever = growdevers.find(item => item.id === id);
    if (!growdever) {
      return res.status(404).send({
        ok: false,
        mensagem: "Growdever não encontrado",
      });
    }
  
    growdever.nome = nome;
    growdever.email = email;
    growdever.idade = idade;
    growdever.matriculado = matriculado;
  
    res.status(200).send({
      ok: true,
      mensagem: "Growdever atualizado com sucesso",
      dados: growdever
    });
  });

//PATCH /growdevers/:id - Toggle do campo matriculado
app.patch('/growdevers/:id', [validateGrowdeverMiddleware], (req, res) => {
    // 1ª etapa é a entrada de dados
    const {id} = req.params;

    // 2ª etapa é o processamento dos dados
    const growdever = growdevers.find(item => item.id === id);
    if(!growdever) {
        return res.status(404).send({
            ok:false,
            mensagem: "Growdever não encontrado"
        })
    }

    growdever.matriculado = !growdever.matriculado;
    // 3ª etapa é a saída dos dados

    res.status(200).send({
        ok:true,
        mensagem:"Growdever atualizado (matricula) com sucesso",
        dados: growdevers
    })
})

//DELETE /growdevers/:id - Deleta um growdever da lista
app.delete('/growdevers/:id', (req, res) => {

    // 1ª etapa é a entrada de dados
    const {id} = req.params

    // 2ª etapa é o processamento dos dados
    const growdeverIndex = growdevers.findIndex(item => item.id === id);
    if(growdeverIndex < 0) {
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        })
    }

    growdevers.splice(growdeverIndex, 1);

    // 3ª etapa é a saída dos dados

    res.status(200).send({
        ok: true,
        mensagem: "Growdever excluido com sucesso",
        dados: growdevers
    });

})
     
const porta = process.env.PORT;
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

