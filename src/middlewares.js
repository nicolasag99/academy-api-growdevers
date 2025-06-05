import { ok } from "assert";
import { group, log } from "console";
import { growdevers } from "./dados.js";

export const logMiddleware = (req, res, next) => {
    console.log("Hello Middleware");

    next();
}

export const validateGrowdeverMiddleware = (req, res, next) => {
    try {

        const body = req.body;


        if(!body.nome) {
            return res.status(400).send({
                ok: false,
                mensagem: "O nome não foi informado"
            })
        }

        if(!body.email) {
            return res.status(400).send({
                ok: false,
                mensagem: "O email não foi informado"
            })
        }

        if(!body.idade) {
            return res.status(400).send({
                ok: false,
                mensagem: "A idade não foi informada"
            })
        }

        if(Number(body.idade) < 18) {
            return res.status(400).send({
                ok: false,
                mensagem: "O growdever deve ser maior ou igual a 18 anos"
            })
        }

        next();

    } catch(error){
        return res.status(500).send({
            ok: false,
            mensagem: error.toString()
        })
        

    }
}

export const logBody = (req, res, next) => {
    console.log(req.body)
    next();
}

export const validateGrowdeverMatriculadoMiddleware = (req, res, next) => {
    try {
        const {id} = req.params;
        const growdever = growdevers.find(item => item.id === Number(id));
        if(!growdever){
           return next();
        }

        if(!growdever.matriculado) {
            return res.status(400).send({
                ok: false,
                mensagem: "Growdever não matriculado não pode atualizar seus dados"
            })
        }

        next();

    } catch(error) {
        return res.status(500).send({
            ok: false,
            mensagem: error.toString()
        })
    }
}
