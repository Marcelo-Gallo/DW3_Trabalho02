// Controlador Front-End para o Módulo de Fornecedores.

const axios = require("axios");
const moment = require("moment"); 

const SERVIDOR_DW3 = process.env.SERVIDOR_DW3; // Endereço da API do Back-End



// Função de validação 
function validateForm(regFormPar) {
    return regFormPar;
}


const GetAllFornecedores = async (req, res) => (async () => {
    const userName = req.session.userName; 
    const token = req.session.token; 
    let remoteMSG = null;
    let resp = null;
    
    try {
        resp = await axios.post(SERVIDOR_DW3 + "/getAllFornecedores", {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            }
        });

    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            remoteMSG = "Servidor Back-End indisponível";
        } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            remoteMSG = "Usuário não autenticado ou sessão expirada";
        } else {
            remoteMSG = error.message;
        }
        
        return res.render("fornecedores/view_manutencao.ejs", {
            title: "Manutenção de Fornecedores", data: [], erro: remoteMSG, userName: userName,
        });
    }

    if (resp.data.status !== "ok") {
        remoteMSG = resp.data.message || "Erro desconhecido na API.";
        return res.render("fornecedores/view_manutencao.ejs", {
            title: "Manutenção de Fornecedores", data: [], erro: remoteMSG, userName: userName,
        });
    }

    res.render("fornecedores/view_manutencao.ejs", {
        title: "Manutenção de Fornecedores", data: resp.data.registro, erro: null, userName: userName,
    });
})();


const InsertFornecedores = (req, res) => (async () => {
    var oper = "";
    var registro = {};
    const userName = req.session.userName;
    const token = req.session.token;

    try {
        // Bloco GET: Abre o formulário
        if (req.method == "GET") {
            oper = "c"; 
            registro = {
                fornecedorid: 0, nomefantasia: "", razaosocial: "", cnpj: "", removido: false,
            };

            return res.render("fornecedores/view_cadFornecedor.ejs", {
                title: "Cadastro de Fornecedor", data: registro, oper: oper, userName: userName, message: null,
            });

        // Bloco POST: Salva o registro
        } else {
            oper = "c";
            const fornecedorREG = validateForm(req.body); 
            
            // Validação mínima para não enviar para a API se os dados estiverem vazios
            if (!fornecedorREG.nomefantasia || !fornecedorREG.razaosocial || !fornecedorREG.cnpj) {
                 return res.render("fornecedores/view_cadFornecedor.ejs", {
                    title: "Cadastro de Fornecedor", data: fornecedorREG, message: "Todos os campos são obrigatórios.", oper: oper, userName: userName,
                });
            }

            const resp = await axios.post(
                SERVIDOR_DW3 + "/insertFornecedor",
                fornecedorREG,
                { headers: { "Content-Type": "application/json", Authorization: "Bearer " + token } }
            );

            if (resp.data.status == "ok") {
                return res.redirect("/fornecedores"); // Sucesso: volta para a listagem
            } else {
                return res.render("fornecedores/view_cadFornecedor.ejs", {
                    title: "Cadastro de Fornecedor", data: fornecedorREG, message: resp.data.message || "Erro desconhecido ao salvar.", oper: oper, userName: userName,
                });
            }
        }
    } catch (erro) {
        console.log("[ctlFornecedores.js|InsertFornecedores] Erro:", erro.message);
        return res.render("fornecedores/view_cadFornecedor.ejs", {
            title: "Cadastro de Fornecedor", data: req.body, message: "Erro de conexão com a API.", oper: oper, userName: userName,
        });
    }
})();



const ViewFornecedores = (req, res) => (async () => {
    var oper = "";
    var registro = {};
    const userName = req.session.userName;
    const token = req.session.token;

    try {
        //  GET: Exibir dados para Visualizar ou Editar 
        if (req.method == "GET") {
            const id = req.params.id; // ID do Fornecedor na URL
            oper = req.params.oper; // Operação (v, vu) na URL
            
            const resp = await axios.post(
                SERVIDOR_DW3 + "/getFornecedorByID",
                { fornecedorid: id },
                { headers: { "Content-Type": "application/json", Authorization: "Bearer " + token } }
            );

            if (resp.data.status == "ok") {
                registro = resp.data.registro[0];
                
                // Formatação de data (mantida por padrão)
                if (registro.datapedido) {
                    registro.datapedido = moment(registro.datapedido).format("YYYY-MM-DD");
                }
                
                res.render("fornecedores/view_cadFornecedor.ejs", {
                    title: "Visualizar/Editar Fornecedor", data: registro, oper: oper, message: null, userName: userName,
                });
            } else {
                console.log("[ctlFornecedores|ViewFornecedores] ID não localizado!");
                return res.redirect("/fornecedores");
            }

        //  POST: Salvar Alteração (Chamado pelo JavaScript da View) 
        } else {
            oper = "vu";
            const fornecedorREG = validateForm(req.body); 
            
            const resp = await axios.post(
                SERVIDOR_DW3 + "/updateFornecedor", fornecedorREG,
                { headers: { "Content-Type": "application/json", Authorization: "Bearer " + token } }
            );

            if (resp.data.status == "ok") {
                return res.json({ status: "ok" }); // Retorna JSON de sucesso para o JavaScript
            } else {
                return res.json({ status: "erro", message: resp.data.message }); // Retorna JSON de erro
            }
        }
    } catch (erro) {
        console.log("[ctlFornecedores.js|ViewFornecedores] Erro:", erro.message);
        
        if (req.method === "GET") {
            return res.redirect("/fornecedores"); // Falha na busca, volta para a lista
        } else {
            return res.json({ status: "erro", message: "Erro de conexão/API na atualização." });
        }
    }
})();



const DeleteFornecedores = (req, res) => (async () => {
    const token = req.session.token;
    
    try {
        const { fornecedorid } = req.body;
        
        const resp = await axios.post(
            SERVIDOR_DW3 + "/DeleteFornecedores",
            { fornecedorid: fornecedorid },
            { headers: { Authorization: "Bearer " + token } }
        );

        if (resp.data.status == "ok") {
            return res.json({ status: "ok" });
        } else {
            return res.json({ status: "erro", message: resp.data.message });
        }
    } catch (erro) {
        console.log("[ctlFornecedores.js|DeleteFornecedores] Erro:", erro.message);
        return res.json({ status: "erro", message: "Erro de conexão/API na remoção." });
    }
})();




module.exports = {
    GetAllFornecedores,
    InsertFornecedores,
    ViewFornecedores,
    DeleteFornecedores,
};