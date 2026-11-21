# Fila Clara — Sistema Inteligente de Filas para Supermercados

Prova de conceito para a segunda entrega do Projeto Integrador. O cliente consulta os caixas sem cadastro, recebe a indicação da menor espera e acompanha mudanças a cada cinco segundos. Dados de sensores são simulados. Esta entrega não comprova precisão em filas reais.

## Comece aqui
O ZIP possui duas pastas raiz: `backend/` e `frontend/`. Este README é o guia geral. Extraia ambas na mesma pasta. Abra essa pasta no VS Code. Não execute de dentro do ZIP.

Stack: Java 25, Spring Boot 4.1.2, Maven, PostgreSQL 17, React 19, TypeScript, Vite e Tailwind CSS 4. Sem Lombok. Versões exatas do frontend fixadas no package.json e no package-lock.json. Confira a matriz completa em docs/COMPATIBILIDADE.md.

## Pré-requisitos
- JDK 25 configurado em JAVA_HOME; confira `java -version`.
- Node.js 24 LTS e npm 10 ou 11; confira `node -v` e `npm -v`. Node 22.12+ na linha 22 também é aceito.
- PostgreSQL 17 instalado ou Docker com Compose.
- Internet na primeira instalação para baixar dependências.
- Maven 3.9.11 se não utilizar o wrapper.

## 1. Banco de dados
Opção A, Docker (apenas para o banco):
```sh
cd backend
docker compose up -d
```
O banco fica em localhost:5432, nome queue_demo, usuário queue_user e senha local queue_local. O volume mantém os dados entre reinicializações. Não use `docker compose down -v` se quiser preservá-los.

Opção B, PostgreSQL instalado: abra o pgAdmin ou psql como administrador e execute, fora de uma transação:
```sql
CREATE USER queue_user WITH PASSWORD 'queue_local';
CREATE DATABASE queue_demo OWNER queue_user;
```
Não precisa executar os scripts internos manualmente: o backend cria a tabela e insere quatro exemplos na primeira inicialização. Reiniciar não sobrescreve alterações existentes.

## 2. Iniciar o backend
Dentro de backend, habilite a simulação para poder editar filas.

Windows PowerShell:
```powershell
$env:SIMULATION_ENABLED="true"
.\mvnw.cmd spring-boot:run
```
Linux/macOS:
```sh
chmod +x mvnw
SIMULATION_ENABLED=true ./mvnw spring-boot:run
```
Alternativa com Maven instalado: `mvn spring-boot:run` no mesmo terminal em que definiu a variável.

Verifique http://localhost:8080/api/health e http://localhost:8080/api/caixas.

## 3. Iniciar o frontend
Em outro terminal:
```sh
cd frontend
npm ci
npm run dev
```
Abra http://localhost:5173. O Vite encaminha `/api` para localhost:8080. Não é necessário liberar CORS para este modo. Caso o Vite escolha outra porta, use o endereço exibido no terminal.

## 4. Demonstração
1. A tela deve recomendar o Caixa 2 (4 minutos).
2. Entre na aba Simular movimento, escolha Caixa 2 e altere produtos para 100.
3. Clique em Aplicar alteração. O Caixa 3 passa a ser recomendado (5 min 30 s).
4. Feche o Caixa 3. A recomendação muda para o Caixa 1.
5. Feche todos os caixas: a tela informa que não há caixa disponível.
6. Restaure os valores originais: Caixa 1 aberto, 2 pessoas e 40 produtos; Caixa 2 aberto, 3 e 15; Caixa 3 aberto, 1 e 30; Caixa 4 fechado, 0 e 0.

Os dados persistem no PostgreSQL. Abrir duas abas permite editar em uma e ver a atualização periódica na outra. No modo de consulta não há login.

## 5. Celular e QR Code
Conecte celular e computador à mesma rede. Descubra o IPv4 local do computador (`ipconfig` no Windows). Abra no celular `http://IP_DO_COMPUTADOR:5173`, substituindo o endereço. Permita acesso à porta do Vite no firewall na rede privada. Expanda “Abrir no celular” quando a página estiver aberta pelo IP, para gerar um QR com endereço acessível na rede. Um QR gerado em localhost aponta para o próprio dispositivo. O QR e a rede local não constituem hospedagem pública.

## Configuração
O Spring lê variáveis do ambiente; ele NÃO carrega automaticamente arquivos .env. Exemplo PowerShell:
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/queue_demo"
$env:DB_USER="queue_user"
$env:DB_PASSWORD="queue_local"
$env:PORT="8080"
$env:SIMULATION_ENABLED="true"
```
`SIMULATION_ENABLED` é false por padrão. Habilite apenas em demonstração controlada: a rota de edição não tem autenticação. Para consulta pública, deixe false e implemente autenticação antes de liberar edição. A aba permanece visível como ferramenta demonstrativa, mas o servidor rejeita a edição se desativada. Credenciais fornecidas são exemplos exclusivamente locais.

## API
- GET /api/health: estado do processo (não verifica o banco).
- GET /api/caixas: `checkouts`, `recommendedId` e `fetchedAt`.
- PATCH /api/caixas/{id}: aceita qualquer subconjunto não vazio de `open`, `people`, `products` quando simulação está habilitada.

Exemplo de corpo no Postman, método PATCH, http://localhost:8080/api/caixas/2, Body > raw > JSON:
```json
{"open":true,"people":3,"products":100}
```
Importe `docs/postman_collection.json`. Respostas de erros de validação usam HTTP 400; caixa inexistente usa 404. Sem simulação, PATCH também retorna 404.

## Regras
Espera em segundos = pessoas × 30 + produtos × 10. Os parâmetros são hipóteses didáticas, não medição nem IA. Quantidades representam as pessoas à frente e o total de produtos delas. Não há cálculo do atendimento parcial em andamento.
- Somente caixas abertos são candidatos.
- Empate: menor número do caixa.
- Fila vazia aberta: zero segundos.
- Nenhum aberto: recommendedId nulo.
- Pessoas entre 0 e 1000, produtos entre 0 e 100000; inteiros.
- Zero pessoas exige zero produtos; produtos zero com pessoas é permitido (etapa de pagamento).
- Caixa fechado mantém os valores para futura reabertura, mas waitSeconds é nulo.
- A interface oculta a recomendação ao falhar a consulta e sinaliza que dados antigos podem estar desatualizados.

## Organização e arquitetura
Frontend React → API Spring MVC → serviço de recomendação → Spring Data JPA → PostgreSQL.
`CheckoutController` consulta; `SimulationController` edita; `CheckoutService` aplica regras; `WaitEstimator` calcula; `CheckoutRepository` acessa dados. DTOs usam records. A tabela checkouts tem id, number, open, people, products e updated_at. A estimativa é calculada, não persistida.

## Testes e build
```sh
# backend
./mvnw test
./mvnw package
# frontend
npm ci
npm run build
```
No Windows use `mvnw.cmd`. Veja `docs/VALIDACAO.md` para o que foi verificado na geração do pacote e o que precisa ser validado localmente.

## Execução integrada do build
Para servir frontend e API na mesma origem, execute `npm run build` em frontend. Copie TODO o conteúdo de frontend/dist para backend/src/main/resources/static. Execute `./mvnw package` em backend. Inicie com `java -jar target/fila-clara-1.0.0.jar` e abra http://localhost:8080. O backend continua precisando do PostgreSQL. Defina as mesmas variáveis no terminal antes de iniciar o JAR. A interface usa uma página única, sem rotas adicionais. Não use `npm run preview` para demonstrar a integração sem configurar proxy: o proxy fornecido é de desenvolvimento.

## Segunda entrega
Use o template oficial do Blackboard, não fornecido neste pacote. Inclua objetivo da PoC, jornada da Persona 1, justificativa do uso de dados simulados, arquitetura, modelo, telas e resultados realmente observados. Corrija a referência “Passport” no texto original. O prazo informado no PDF é 23/11/2026 às 23h59 de Brasília; confira no ambiente da disciplina.

Rubrica: definição 1 ponto, ambiente 2, frontend 2, backend 2, vídeo 1 e GitHub 2. O vídeo tem no máximo 1 minuto. O repositório deve ter todos os integrantes e histórico real de contribuições. Não foi publicado repositório nem gravado vídeo automaticamente.

## GitHub
Crie um repositório e inicialize o Git na pasta que contém frontend e backend. Copie este README para a raiz do repositório, se desejado. Adicione todos os integrantes. Não envie node_modules, target, senhas reais ou arquivos .env. Faça commits representando contribuições reais.

## Limites
Uma loja, quatro caixas, parâmetros fixos, atualização por polling. Sem sensores, login, reservas de posição, pagamentos ou validação de precisão em campo. Uso simultâneo de editores aplica a última alteração recebida; controle de concorrência e autenticação ficam para evolução. Os scripts idempotentes são adequados a primeira instalação e demonstração; evolução de schema deve adotar migrações versionadas.

## Interface revisada
A consulta apresenta tabela comparativa de filas, indicação discreta do caixa recomendado e formulário de simulação separado. No celular, quantidades ficam junto ao nome do caixa e a coluna de espera permanece visível. A aplicação inclui navegação por teclado, rótulos de formulário, carregamento, falha de atualização e ausência de caixas abertos. As explicações da estimativa e o QR Code ficam recolhidos.
