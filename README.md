## Atividade do Fórum Avaliativo de Segurança da Informação

### Descrição do desafio

   Desenvolver um sistema de autenticação que emprega hash e salting para armazenar e validar senhas de forma segura.

### Requisitos da Aplicação: 

1. **Estrutura de Dados de Usuário:**
   Crie uma estrutura de dados que inclua pelo menos um identificador de usuário (como um nome de usuário ou e-mail), a senha hash e o salt.

2. **Registro de Usuário:**
   Ao registrar um novo usuário, gere um sal único e aplique o hash na combinação da senha e do salt. Armazene o nome de usuário, o hash e o salt.

3. **Armazenamento Seguro:**
   As credenciais dos usuários devem ser armazenadas de forma segura, utilizando um banco de dados ou um arquivo local protegido.

4. **Login e Verificação:**
   Durante o login, aplique o mesmo processo de hash na senha fornecida com o salt armazenado e compare o resultado com o hash armazenado para autenticação.

### Tecnologias necessárias:

1. **Node.js**

2. **Express**
   
3. **Knex**
   
4. **Crypto**

5. **PostgreSQL**

### Desenvolvimento:

Para esse desafio foi desenvolvido um servidor Node.js utilizando o framework Express, juntamente com o Knex para interação com um banco de dados PostgreSQL. O servidor tem dois endpoints principais para cadastro de usuários e login de usuários.

#### Cadastro do usuário

```http
  POST /
```

- Os dados do corpo da requisição são:

   ```const { name, email, password } = req.body;```


- Utilizando o Knex, uma consulta ao banco de dados é feita para obter o próximo valor da sequência (neste caso, a sequência chamada 'id_usuario'). Isso é feito para obter um identificador único para o novo usuário.

   ```const id = await db.select(db.raw("nextval('id_usuario')"));```

- O salt é gerado utilizando o valor obtido da sequência como base, que será o id do usuário no banco de dados, utilizando o crypto para gerar o hash. Em seguida, a senha do usuário é concatenada com esse salt, e o resultado é transformado em hash. 

   ```const salt = crypto.createHash('sha256').update((id[0].nextval.toString())).digest('hex');```

   ```const passwordWithHash = crypto.createHash('sha256').update(password + salt).digest('hex');```

- Os dados do novo usuário, incluindo o ID, nome, e e-mail, juntamente com a senha hash, são inseridos na tabela 'usuarios' do banco de dados.

   ```await db('usuarios').insert({ id: id[0].nextval, nome: name, email: email, senha: passwordWithHash });```





#### Login e Autenticação do usuário

```http
  POST /login
```

- Os dados do corpo da requisição são:

   ```const { email, password } = req.body;```

- Utilizando o Knex, uma consulta ao banco de dados é feita para obter o ID do usuário com o e-mail fornecido:

   ``const id = await db('usuarios').select({ id: 'id' }).where({ email: email });```

- O salt é gerado utilizando o ID do usuário obtido. Em seguida, a senha fornecida no login é combinada com esse salt, e o resultado transformado em hash:

   ```const salt = crypto.createHash('sha256').update((id[0].id.toString())).digest('hex');```

   ```const passwordWithHash = crypto.createHash('sha256').update(password + salt).digest('hex');```

- Outra consulta ao banco de dados é realizada para verificar se existe um usuário com a senha hashada correspondente à senha fornecida no login e com o mesmo ID:

   ```const auth = await db('usuarios').select({ nome: 'nome' }).where({ senha: passwordWithHash }).where({ id: id[0].id });```

- Com base no resultado da autenticação, uma mensagem é gerada. Se o nome do usuário retornado da consulta for nulo, significa que o usuário não foi encontrado:

   ```const message = (auth[0].nome === null) ? "Usuário não existe" : "Usuário encontrado";```



   
