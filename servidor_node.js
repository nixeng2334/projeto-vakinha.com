const express = require("express")

const path = require("path");

const cors = require("cors");

const { Pool } = require("pg");

const basicAuth = require("express-basic-auth");

const app = express();

app.use(cors({ origin: "*"}));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const ADMIN_USER = process.env.ADMIN_USER || "admin";

const ADMIN_PASS = process.env.ADMIN_PASS || "222328pb";

const protecaoAdmin = basicAuth({

users: { [ADMIN_USER]: ADMIN_PASS},

challenge: true, unauthorizedResponse: "Acesso negado."

});

const pool = new Pool({

connectionString: process.env.DATABASE_URL,

ss1: { rejectUnauthorized: false }

});

const criarTabela = async () => {

try {

await pool.query(`

CREATE TABLE IF NOT EXISTS pedidos ( id SERIAL PRIMARY KEY, dados JSONB NOT NULL, criando_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

`);

console.log("Tabela 'pedidos' pronta!");

} catch (err) {

console.error("Erro ao criar tabela:", err);

}

};

criarTabela();

app.post("/pedido", async (req, res) => {

try {

const dadosFormulario = req.body;

await pool.query(

"INSERT INTO pedidos (dados) VALUES ($1)",

[JSON.stringify(dadosFormulario)]

);

console.log("Pedido salvo no banco de dados!");

res.status(200).send("Pedido recebido e salvo no banco de dados! Aguarde.");

} catch (err) {

console.error("Erro ao salvar no banco:", err);

res.status(500).send("Erro interno ao salvar o pedido.");

}

});

app.get("/pedidos", protecaoAdmin, async (req, res) => {

try {

const resultado = await pool.query("SELECT * FROM pedidos ORDER BY id DESC");

res.setHeader('Content-Type', 'application/json');

res.send(JSON.stringify(resultado.rows, null, 2));

} catch (err) {

console.error("Erro ao buscar pedidos:", err);

res.status(500).send("Erro do PostgreSQL: " + err.message);

}

});

const PORT = process.env. PORT || 3000;

app.listen(PORT, () => {

console.log('Servidor rodando na porta ${PORT}');

});