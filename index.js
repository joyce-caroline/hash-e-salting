const knex = require('knex');
const express = require('express');
const app = express();
const crypto = require('crypto');
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'promises'
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cadastro de usuário
app.post('/', async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const id = await db.select(db.raw("nextval('id_usuario')"));
    const salt = crypto.createHash('sha256').update((id[0].nextval.toString())).digest('hex');
    const passwordWithHash = crypto.createHash('sha256').update(password + salt).digest('hex');
    await db('usuarios').insert({ id: id[0].nextval ,nome: name, email: email, senha: passwordWithHash });
    res.status(201).json({ name, email, passwordWithHash });
  } catch (error) {
      console.error(error);
      res.status(500).send("Deu erro");
  }
});

//Login de Usuário
app.post('/login', async function (req, res) {
  try {
    const {email, password } = req.body;
    const id  = await db('usuarios').select({id: 'id'}).where({email: email});
    const salt = crypto.createHash('sha256').update((id[0].id.toString())).digest('hex');
    const passwordWithHash = crypto.createHash('sha256').update(password + salt).digest('hex');
    const auth = await db('usuarios').select({nome: 'nome'}).where({senha: passwordWithHash}).where({id: id[0].id});
    const message = (auth[0].nome === null) ? "Usuário não existe"  : "Usuário encontrado";
    res.status(200).json(message);  
  } catch (error) {
      console.error(error);
      res.status(500).send("Deu erro");
  }
});


app.listen(5005, () => {
  console.log("Aplicação rodando na porta 5005")
})




