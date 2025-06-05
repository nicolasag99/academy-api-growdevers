import axios from "axios";

axios
    .get('viacep.com.br/ws/93415270/json/')
    .then((result) => {
        console.log(result.data);
    })
    .catch((error) => {
        console.error(error);
    });


// async function listarCep(cep) {
//     try {
//         const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
//         console.log(result.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// listarCep("93415270");