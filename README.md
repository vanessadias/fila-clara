# Fila Clara

## Sistema Inteligente de Filas para Supermercados

Prova de conceito (PoC) da segunda entrega do Projeto Integrador do curso de Tecnologia em Análise e Desenvolvimento de Sistemas do SENAC EAD.

O Fila Clara permite consultar os caixas de um supermercado sem cadastro, comparar estimativas de espera e identificar o caixa aberto com menor tempo calculado. A aplicação reúne frontend React, API Java e persistência PostgreSQL. As informações são atualizadas a cada cinco segundos e podem ser alteradas por um editor de simulação para demonstrar o comportamento do sistema.

**Os dados das filas são simulados.** Os parâmetros de tempo são didáticos; esta entrega não comprova precisão de sensores ou redução de espera em um supermercado real.

## Sumário

1. [Problema e objetivo](#problema-e-objetivo)
2. [Jornada selecionada e escopo](#jornada-selecionada-e-escopo)
3. [Equipe](#equipe)
4. [Tecnologias e pré-requisitos](#tecnologias-e-pré-requisitos)
5. [Arquitetura e organização](#arquitetura-e-organização)
6. [Banco de dados e regras](#banco-de-dados-e-regras)
7. [Instalação e execução](#instalação-e-execução)
8. [Configuração por ambiente](#configuração-por-ambiente)
9. [API e Postman](#api-e-postman)
10. [Roteiro de demonstração](#roteiro-de-demonstração)
11. [Acesso pelo celular e QR Code](#acesso-pelo-celular-e-qr-code)
12. [Testes e validação](#testes-e-validação)
13. [Build integrado](#build-integrado)
14. [Vídeo e materiais da segunda entrega](#vídeo-e-materiais-da-segunda-entrega)
15. [Colaboração e versionamento](#colaboração-e-versionamento)
16. [Problemas frequentes](#problemas-frequentes)
17. [Limitações e próximos passos](#limitações-e-próximos-passos)

## Problema e objetivo

A fila com menos pessoas nem sempre é a mais rápida: a quantidade de produtos também influencia o tempo de atendimento. O projeto propõe fornecer ao cliente uma comparação simples entre os caixas, apoiando sua decisão no momento de entrar na fila.

O objetivo desta PoC é demonstrar que o sistema consegue consultar dados persistidos, calcular as estimativas, excluir caixas fechados e atualizar a recomendação quando o estado das filas muda.

## Jornada selecionada e escopo

Foi selecionado o trecho de consulta e escolha de caixa da jornada da Persona 1, Vanessa, apresentada na primeira entrega.

| Etapa | Ação do cliente | Resposta do sistema |
| --- | --- | --- |
| Acesso | Escaneia o QR Code disponível no estabelecimento | Abre a aplicação web sem solicitar login |
| Consulta | Visualiza a lista de caixas | Apresenta disponibilidade, pessoas, produtos e espera |
| Decisão | Compara as alternativas | Destaca o caixa com menor espera estimada |
| Acompanhamento | Mantém a página aberta | Atualiza os dados por consultas periódicas à API |

Esse recorte foi escolhido por concentrar o benefício principal da proposta e permitir testar a integração entre interface, API e banco sem depender de sensores físicos.

### Funcionalidades implementadas

- Consulta dos caixas sem cadastro ou autenticação.
- Interface responsiva para desktop e celular.
- Estimativa de espera e recomendação automática.
- Desempate pelo menor número do caixa.
- Atualização periódica a cada cinco segundos.
- QR Code para compartilhar o endereço da aplicação.
- Editor de simulação, condicionado à configuração do backend.
- Validação de entradas e tratamento de erros.
- Persistência das alterações no PostgreSQL.
- Estados de carregamento, falha de atualização e ausência de caixas abertos.

### Itens fora do recorte

Sensores físicos, autenticação administrativa, relatórios gerenciais, pagamentos, reserva de lugar e medição real do ritmo de atendimento não fazem parte desta PoC. O editor de simulação não constitui um painel administrativo completo.

## Equipe

- Caio Mendes de Assis
- Cauã Rodrigues de Assis
- Flávio Alves da Silva
- Hericles Antônio da Silva Alves
- Vanessa de Jesus Sousa Dias

**Antes da entrega:** adicionar todos os integrantes como colaboradores ou membros do repositório, confirmar os convites aceitos e registrar contribuições reais por commits e pull requests. Não foram atribuídos papéis individuais sem confirmação do grupo.

## Tecnologias e pré-requisitos

As versões abaixo correspondem aos arquivos do pacote utilizado para elaborar este README; não representam uma atualização automática para versões futuras.

| Componente | Versão ou requisito |
| --- | --- |
| Java | JDK 25, com `JAVA_HOME` configurado |
| Spring Boot | 4.1.2 |
| Maven | 3.9.11 pelo Maven Wrapper; instalação global opcional |
| PostgreSQL | 17 na configuração Docker fornecida |
| Node.js | Linha 24; alternativamente linha 22 a partir de 22.12.0 |
| npm | 10 ou 11 |
| React e React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| Vite | 7.3.7 |
| Tailwind CSS e plugin Vite | 4.3.4 |
| Docker Compose | Opcional, somente para iniciar o banco |

O backend utiliza Spring MVC, Bean Validation, Spring Data JPA e Hibernate, sem Lombok. Os DTOs utilizam records. O frontend mantém as versões no `package.json` e no `package-lock.json`; utilize `npm ci` para reproduzi-las.

Verifique os pré-requisitos:

```sh
java -version
node -v
npm -v
git --version
```

A primeira execução precisa de internet para obter as dependências. Não é necessário recriar o frontend com um gerador.

## Arquitetura e organização

O navegador executa a interface React. As requisições são atendidas pela API Spring MVC, que aplica as regras de negócio e acessa o PostgreSQL por meio do Spring Data JPA. O frontend não acessa o banco diretamente.

No desenvolvimento, o Vite encaminha requisições `/api` para `http://localhost:8080`. O navegador utiliza a mesma origem do frontend, dispensando uma configuração separada de CORS nesse modo.

| Caminho | Conteúdo |
| --- | --- |
| `README.md` | Guia principal do repositório |
| `frontend/` | Aplicação React, estilos, configuração Vite e dependências |
| `frontend/src/` | Código-fonte da interface |
| `backend/pom.xml` | Dependências e configuração Maven |
| `backend/mvnw` e `backend/mvnw.cmd` | Inicialização do Maven no Linux/macOS e Windows |
| `backend/.mvn/wrapper/` | Configuração do Maven Wrapper |
| `backend/compose.yaml` | PostgreSQL local com volume persistente |
| `backend/src/main/java/br/edu/senac/queue/` | Código-fonte da API |
| `backend/src/main/resources/application.yml` | Configuração Spring com variáveis de ambiente |
| `backend/src/main/resources/schema.sql` | Criação da tabela |
| `backend/src/main/resources/data.sql` | Dados iniciais idempotentes |
| `backend/src/test/` | Testes automatizados do backend |
| `backend/docs/` | Guias de validação, compatibilidade e entrega |

### Responsabilidades do backend

| Classe | Responsabilidade |
| --- | --- |
| `CheckoutController` | Consulta dos caixas |
| `SimulationController` | Atualizações no modo de simulação |
| `CheckoutService` | Validação e regras da aplicação |
| `WaitEstimator` | Cálculo da estimativa |
| `CheckoutRepository` | Acesso aos registros persistidos |
| `Checkout` | Entidade de caixa |
| `CheckoutUpdate` | Dados recebidos na atualização |
| `ApiErrors` | Tratamento dos erros da API |

## Banco de dados e regras

### Modelo relacional

A PoC utiliza a tabela `checkouts`:

| Coluna | Tipo SQL | Finalidade |
| --- | --- | --- |
| `id` | `BIGINT PRIMARY KEY` | Identificador do caixa |
| `number` | `INTEGER NOT NULL UNIQUE` | Número exibido ao cliente |
| `open` | `BOOLEAN NOT NULL` | Disponibilidade do caixa |
| `people` | `INTEGER NOT NULL` | Quantidade de pessoas na fila |
| `products` | `INTEGER NOT NULL` | Quantidade total de produtos dessas pessoas |
| `updated_at` | `TIMESTAMP WITH TIME ZONE NOT NULL` | Momento da atualização |

A espera é calculada pela aplicação, sem coluna própria no banco.

### Estimativa

**Espera em segundos = pessoas × 30 + produtos × 10.**

Os coeficientes são hipóteses didáticas. Não há inteligência artificial nem medição do atendimento parcialmente concluído.

- Somente caixas abertos participam da recomendação.
- Em empate, vence o menor número de caixa.
- Caixa aberto e vazio possui espera zero.
- Sem caixas abertos, `recommendedId` é nulo.
- Pessoas devem ser inteiras entre 0 e 1.000; produtos, entre 0 e 100.000.
- Zero pessoas exige zero produtos.
- Pessoas com zero produtos são permitidas, representando uma etapa de pagamento.
- Fechar um caixa preserva suas quantidades, mas sua espera na resposta fica nula.
- Ao falhar a consulta, a interface oculta a recomendação e informa que os dados anteriores podem estar desatualizados.

### Dados iniciais

| Caixa | Aberto | Pessoas | Produtos | Espera calculada |
| --- | --- | --- | --- | --- |
| 1 | Sim | 2 | 40 | 460 s — 7 min 40 s |
| 2 | Sim | 3 | 15 | 240 s — 4 min |
| 3 | Sim | 1 | 30 | 330 s — 5 min 30 s |
| 4 | Não | 0 | 0 | Não participa |

O caixa 2 é recomendado nesse cenário.

## Instalação e execução

### 1. Obter o código

Clone o repositório, substituindo `SEU_USUARIO` pelo proprietário correto:

```sh
git clone https://github.com/SEU_USUARIO/fila-clara.git
cd fila-clara
```

Alternativamente, extraia o ZIP em uma pasta. Abra no VS Code a pasta que contém `frontend/` e `backend/`, sem executar os comandos diretamente dentro do ZIP.

### 2. Iniciar o banco

Escolha apenas uma das opções seguintes.

#### Opção A — Docker Compose

Na raiz do projeto:

```sh
cd backend
docker compose up -d
docker compose ps
```

A configuração disponibiliza PostgreSQL em `localhost:5432`, banco `queue_demo`, usuário `queue_user` e senha local de exemplo `queue_local`.

O volume `queue_data` preserva os registros. Para parar o banco, utilize `docker compose stop` na pasta `backend`. Não use `docker compose down -v` se precisar manter os dados: a opção `-v` remove o volume.

#### Opção B — PostgreSQL instalado

Abra o pgAdmin ou conecte pelo `psql` com um usuário administrador. Execute os comandos separadamente, fora de uma transação explícita:

```sql
CREATE USER queue_user WITH PASSWORD 'queue_local';
CREATE DATABASE queue_demo OWNER queue_user;
```

Esses comandos pressupõem que o usuário e o banco ainda não existem. Se já existirem, confira a configuração existente antes de continuar.

**Carga dos scripts:** não execute `schema.sql` e `data.sql` manualmente no fluxo normal. O Spring executa os dois ao iniciar, cria a tabela se necessário e insere os quatro registros ausentes. `ON CONFLICT (id) DO NOTHING` preserva as alterações de registros existentes nas reinicializações. O Hibernate valida o modelo com `ddl-auto: validate`.

### 3. Iniciar o backend

No terminal da pasta `backend`, configure as variáveis e execute a API.

**Windows PowerShell:**

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/queue_demo"
$env:DB_USER="queue_user"
$env:DB_PASSWORD="queue_local"
$env:SIMULATION_ENABLED="true"
.\mvnw.cmd spring-boot:run
```

**Linux ou macOS:**

```sh
chmod +x mvnw
export DB_URL="jdbc:postgresql://localhost:5432/queue_demo"
export DB_USER="queue_user"
export DB_PASSWORD="queue_local"
export SIMULATION_ENABLED="true"
./mvnw spring-boot:run
```

As credenciais acima são exemplos locais. Se escolheu outros valores no banco, use os mesmos valores nas variáveis. Com Maven instalado, é possível usar `mvn spring-boot:run` no terminal já configurado.

Mantenha esse terminal aberto. Verifique:

- Processo da API: <http://localhost:8080/api/health>
- Consulta com acesso ao banco: <http://localhost:8080/api/caixas>

O endpoint de saúde verifica o processo, não a conexão com o banco. Use a consulta de caixas para conferir a integração.

### 4. Iniciar o frontend

Abra outro terminal na raiz do projeto:

```sh
cd frontend
npm ci
npm run dev
```

Acesse <http://localhost:5173>. Caso essa porta esteja ocupada, utilize o endereço informado pelo Vite no terminal.

O script `dev` já configura o Vite para escutar em `0.0.0.0`, permitindo acesso pela rede local quando o firewall autorizar. O proxy está definido em `frontend/vite.config.ts`.

### 5. Encerrar

Pressione `Ctrl+C` nos terminais do frontend e backend. Se utilizou Docker, execute `docker compose stop` dentro de `backend`. Os dados permanecem no banco.

## Configuração por ambiente

| Variável do backend | Padrão | Finalidade |
| --- | --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/queue_demo` | Conexão JDBC |
| `DB_USER` | `queue_user` | Usuário do banco |
| `DB_PASSWORD` | `queue_local` | Senha local de exemplo |
| `PORT` | `8080` | Porta HTTP do backend |
| `SIMULATION_ENABLED` | `false` | Habilita as rotas de edição da simulação |

O Spring lê essas variáveis do processo: **não carrega automaticamente um arquivo `.env`**. Os comandos deste guia usam `application.yml` e não exigem criar ou ativar um perfil `local`.

O frontend utiliza caminhos relativos `/api`; esta configuração não exige variável `VITE_API_URL`. Se alterar a porta do backend, atualize também o destino do proxy em `frontend/vite.config.ts` e reinicie o Vite.

No Compose, `DB_PASSWORD` configura a senha na criação inicial do volume. Alterar essa variável depois não modifica automaticamente a senha de um usuário já criado no PostgreSQL.

A edição não possui autenticação. Habilite `SIMULATION_ENABLED=true` somente em demonstração controlada. Com a opção desabilitada, a aba demonstrativa permanece visível, mas o servidor rejeita alterações.

## API e Postman

URL base local: `http://localhost:8080`.

| Método | Endpoint | Comportamento |
| --- | --- | --- |
| GET | `/api/health` | Estado do processo |
| GET | `/api/caixas` | Retorna `checkouts`, `recommendedId` e `fetchedAt` |
| PATCH | `/api/caixas/{id}` | Atualiza um caixa com a simulação habilitada |

O PATCH aceita qualquer subconjunto não vazio de `open`, `people` e `products`, respeitando o estado final válido do caixa.

### Exemplo no Postman

1. Importe [a coleção do projeto](backend/docs/postman_collection.json).
2. Inicie a API com a simulação habilitada.
3. Crie ou abra a requisição PATCH para `http://localhost:8080/api/caixas/2`.
4. Em **Body → raw → JSON**, informe:

```json
{
  "open": true,
  "people": 3,
  "products": 100
}
```

5. Envie a requisição e consulte `GET /api/caixas`.
6. Confira que o caixa 3 passou a ser recomendado.

### Respostas de erro

- **400:** entrada inválida, como número negativo, quantidade fracionária, produtos sem pessoas ou corpo vazio.
- **404:** caixa inexistente; a rota PATCH também retorna 404 quando a simulação está desabilitada.

## Roteiro de demonstração

Comece com os dados da tabela de dados iniciais. Reiniciar o backend não restaura registros já alterados.

1. Abra a consulta e confira o caixa 2 recomendado com 4 minutos.
2. Abra **Simular movimento**, selecione o caixa 2 e altere seus produtos para 100, mantendo 3 pessoas.
3. Clique em **Aplicar alteração**. Sua estimativa passa a 1.090 segundos e o caixa 3 passa a ser recomendado com 5 min 30 s.
4. Feche o caixa 3. O caixa 1 passa a ser recomendado.
5. Feche todos os caixas. Confira a mensagem de indisponibilidade.
6. Restaure os valores da tabela inicial pelo editor.

Para demonstrar a atualização periódica, mantenha duas abas abertas: edite em uma e acompanhe a consulta na outra. Aguarde o ciclo de atualização e a resposta da rede.

## Acesso pelo celular e QR Code

1. Conecte o computador e o celular à mesma rede.
2. No Windows, execute `ipconfig` e identifique o IPv4 do adaptador utilizado.
3. No celular, abra `http://IP_DO_COMPUTADOR:5173`, substituindo o IP e, se necessário, a porta.
4. Se houver bloqueio, permita o acesso ao Vite no firewall somente na rede privada. Não é necessário expor o PostgreSQL ao celular.
5. Abra também a aplicação pelo IP no computador e expanda **Abrir no celular** para obter o QR Code desse endereço.
6. Escaneie o QR Code e confira a consulta.

Um QR gerado com `localhost` aponta para o próprio dispositivo que o abre. A rede local não equivale a uma publicação na internet.

## Testes e validação

### Testes automatizados do backend

Na pasta `backend`:

```powershell
# Windows PowerShell
.\mvnw.cmd clean verify
```

```sh
# Linux/macOS
./mvnw clean verify
```

Os cinco testes JUnit existentes verificam fórmula, recomendação por tempo, desempate, ausência de caixas disponíveis e atualizações inválidas/inexistentes. O teste automatizado não substitui a execução integrada com PostgreSQL.

### Verificação do frontend

Na pasta `frontend`:

```sh
npm ci
npm run build
```

O build executa a verificação TypeScript e a construção do Vite. Não há script `npm test` no pacote fornecido.

### Aceite manual

| Cenário | Resultado esperado | Registro final do grupo |
| --- | --- | --- |
| Instalação a partir de cópia limpa | Banco, API e interface iniciam seguindo este guia | A preencher |
| Consulta inicial | Caixa 2 recomendado | A preencher |
| Caixa 2 com 100 produtos e 3 pessoas | Caixa 3 recomendado | A preencher |
| Todos os caixas fechados | Ausência de recomendação | A preencher |
| Quantidades inválidas pela API | HTTP 400 | A preencher |
| Identificador inexistente com simulação ativa | HTTP 404 | A preencher |
| Reinício do backend após alteração | Dados continuam persistidos | A preencher |
| QR Code no celular | Página acessível e layout utilizável | A preencher |
| Falha de consulta | Erro apresentado, sem recomendação desatualizada | A preencher |

Registre data, responsável, ambiente, resultado observado e evidências no [roteiro de entrega](backend/docs/ROTEIRO_ENTREGA.md). Substitua “A preencher” somente após executar cada cenário.

### Histórico e limites da validação

O [registro de validação do pacote](backend/docs/VALIDACAO.md) informa builds aprovados, cinco testes JUnit, verificações de interface e integração JDBC com PGlite, utilizando um motor PostgreSQL embarcado. Ele também informa que o PostgreSQL 17 nativo do Compose, a instalação no Windows e o QR Code em celular físico precisam ser conferidos no ambiente de apresentação.

Este README documenta o pacote; sua elaboração não representa uma nova execução desses testes nem aprovação automática dos cenários pendentes.

## Build integrado

É possível servir a interface e a API pelo mesmo processo Java. Mantenha o banco em execução e configure as variáveis de ambiente antes de iniciar o JAR.

**Windows PowerShell, começando na raiz do projeto:**

```powershell
cd frontend
npm ci
npm run build
cd ..
New-Item -ItemType Directory -Force backend/src/main/resources/static | Out-Null
Copy-Item -Path frontend/dist/* -Destination backend/src/main/resources/static -Recurse -Force
cd backend
.\mvnw.cmd clean package
$env:SIMULATION_ENABLED="true"
java -jar target/fila-clara-1.0.0.jar
```

**Linux/macOS, começando na raiz do projeto:**

```sh
cd frontend
npm ci
npm run build
cd ..
mkdir -p backend/src/main/resources/static
cp -R frontend/dist/. backend/src/main/resources/static/
cd backend
chmod +x mvnw
./mvnw clean package
SIMULATION_ENABLED=true java -jar target/fila-clara-1.0.0.jar
```

Acesse <http://localhost:8080>. A simulação acima é apropriada para demonstração local; desabilite-a para disponibilizar somente consulta.

Os comandos pressupõem que `static` esteja vazio ou contenha apenas o build que está sendo atualizado. Em builds sucessivos, remova somente os artefatos gerados anteriores antes da cópia, preservando qualquer arquivo estático mantido manualmente.

Não use `npm run preview` como substituto da integração sem configurar o encaminhamento da API: o proxy fornecido é o de desenvolvimento.

## Vídeo e materiais da segunda entrega

**Vídeo da demonstração:** PENDENTE — inserir o link privado do YouTube com acesso autorizado ao professor ou o caminho do MP4 publicado no GitHub.

O vídeo deve ter no máximo **1 minuto**, com o projeto em execução. Roteiro sugerido:

| Tempo | Demonstração |
| --- | --- |
| 0–10 s | Problema e jornada selecionada |
| 10–25 s | Consulta dos caixas e recomendação inicial |
| 25–45 s | Alteração da fila e mudança de recomendação |
| 45–60 s | Resultado e esclarecimento sobre os dados simulados |

**Documento acadêmico:** PENDENTE — inserir o link ou caminho da versão final conforme o template oficial do Blackboard. O README apoia a reprodução técnica e não substitui esse documento.

### Correspondência com os critérios do enunciado

| Critério | Pontos | Conteúdo ou evidência |
| --- | --- | --- |
| Revisitação e definição da PoC | 1 | Problema, jornada e justificativa do recorte |
| Ambiente e stack | 2 | Pré-requisitos, configurações e instalação |
| Frontend | 2 | Consulta responsiva e jornada funcionando |
| Backend | 2 | API, regras, validação e persistência |
| Vídeo | 1 | Demonstração publicada de até 1 minuto |
| GitHub | 2 | Código completo, README, colaboradores e contribuições reais |

### Checklist de publicação

- [ ] Código completo de frontend e backend publicado.
- [ ] Todos os integrantes adicionados e convites aceitos.
- [ ] Contribuições reais registradas no histórico.
- [ ] Instalação reproduzida a partir de uma cópia limpa.
- [ ] PostgreSQL nativo e cenários finais validados.
- [ ] Resultados e evidências preenchidos.
- [ ] Vídeo de até 1 minuto publicado e acessível ao professor.
- [ ] Documento adequado ao template oficial.
- [ ] Links definitivos inseridos e conferidos.
- [ ] Atividade enviada no Blackboard e comprovante guardado.

## Colaboração e versionamento

Crie o repositório na pasta que contém frontend e backend. O arquivo `.gitignore` deve estar nessa mesma raiz. Versione código, testes, documentação, scripts SQL, `pom.xml`, `package-lock.json` e o Maven Wrapper. Não envie `node_modules`, `target`, credenciais pessoais ou dados locais do banco.

Se uma configuração local for ignorada, forneça um exemplo sem credenciais reais e explique como reproduzi-la. As instruções deste README usam as variáveis suportadas pelo `application.yml` entregue.

Cada integrante deve configurar sua própria identidade Git e registrar o trabalho que efetivamente realizou. Para contribuir em uma branch:

```sh
git switch main
git pull --ff-only
git switch -c docs/revisao-instalacao
```

Após realizar e conferir a alteração:

```sh
git status
git diff
git add README.md
git commit -m "docs: revisa as instrucoes de instalacao"
git push -u origin docs/revisao-instalacao
```

Abra um pull request para `main`, descreva o que mudou e peça a revisão de outro integrante. A identificação de responsabilidades individuais deve refletir o histórico real do grupo.

## Problemas frequentes

| Sintoma | Verificação ou solução |
| --- | --- |
| Java incompatível | Conferir `java -version` e `JAVA_HOME`; utilizar JDK 25 |
| `mvnw` sem permissão | No Linux/macOS, executar `chmod +x mvnw` |
| Falha de autenticação do PostgreSQL | Conferir usuário e senha do banco e as variáveis do terminal do backend |
| Conexão recusada na porta 5432 | Iniciar o PostgreSQL e conferir host, porta e `docker compose ps` |
| Porta 5432 ocupada | Escolher entre PostgreSQL instalado e Docker ou ajustar o mapeamento e `DB_URL` |
| Porta 8080 ocupada | Encerrar o processo conflitante ou alterar `PORT` e o proxy Vite |
| PATCH retorna 404 | Conferir o ID e iniciar o backend com `SIMULATION_ENABLED=true` |
| PATCH retorna 400 | Conferir limites, inteiros, corpo não vazio e consistência entre pessoas e produtos |
| Frontend não carrega os caixas | Testar `/api/caixas`, conferir o backend e o proxy do Vite |
| Caixa 2 não é recomendado ao abrir | Conferir se o banco já contém alterações de demonstrações anteriores |
| QR Code não abre no celular | Usar IP da máquina, mesma rede e permissão no firewall |
| Configuração `.env` não afeta a API | Definir as variáveis no terminal: Spring não lê `.env` automaticamente |
| Dependências Node incompatíveis | Utilizar Node/npm nas faixas indicadas e executar `npm ci` com o lock fornecido |

## Limitações e próximos passos

A PoC considera uma loja, quatro caixas e parâmetros fixos de estimativa. A atualização ocorre por polling e depende da rede. Edições simultâneas aplicam a última alteração recebida, sem controle específico de concorrência.

As evoluções possíveis incluem integração com sensores, calibração dos coeficientes com dados reais, autenticação e autorização administrativa, controle de concorrência, migrações versionadas do banco e avaliação de desempenho. Esses itens não devem ser apresentados como funcionalidades já implementadas.

## Documentação complementar

- [Guia do backend](backend/README.md)
- [Guia do frontend](frontend/README.md)
- [Compatibilidade de dependências](backend/docs/COMPATIBILIDADE.md)
- [Histórico de validação](backend/docs/VALIDACAO.md)
- [Roteiro da segunda entrega](backend/docs/ROTEIRO_ENTREGA.md)
- [Coleção Postman](backend/docs/postman_collection.json)
- [Árvore de dependências Java](backend/dependency-tree.txt)
