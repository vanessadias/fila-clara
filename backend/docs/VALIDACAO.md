# Validação do pacote

Data: 04/11/2026.

## Dependências e compilação
- JDK Zulu 25.0.5.0.3: compilação e execução reais em Java 25, sem override para Java 17.
- Maven 3.9.11: clean verify e geração da árvore de dependências concluídos com BUILD SUCCESS.
- Maven Wrapper oficial 3.3.4: bootstrap e verify também concluídos com BUILD SUCCESS.
- Cinco testes JUnit aprovados: fórmula, recomendação por tempo, desempate, ausência de caixas disponíveis e atualizações inválidas/inexistentes.
- Frontend: npm ci, npm ls --all e npm run build concluídos. TypeScript e Vite sem erros de compilação. package.json e package-lock.json fixam as versões verificadas.

## Integração por JDBC
Backend executado como JAR em Java 25, conectado pelo driver PostgreSQL a um servidor TCP PGlite 0.5.15 (motor PostgreSQL 18.6 embarcado). Não foi usado H2. O ambiente de teste limitou o pool a uma conexão por ser um banco embarcado.

Resultados aprovados:
- Inicialização do schema, carga idempotente e validação do Hibernate.
- Consulta inicial com recomendação do Caixa 2.
- Alteração dos produtos do Caixa 2 para 100 e recomendação do Caixa 3.
- HTTP 400 para números negativos, fracionários, produtos sem pessoas e corpo vazio.
- HTTP 404 para identificador inexistente.
- Ausência de recomendação com todos os caixas fechados.
- Reinicialização sobre os dados persistidos do banco de teste.

## Interface
Chromium 134 via Playwright foi usado para verificar:
- Tela de consulta e editor em desktop.
- Larguras de 320, 390 e 768 pixels sem overflow horizontal.
- Recomendação, edição, ausência de caixas e falha de consulta com API controlada no teste.
- Fluxo real: navegador → proxy Vite → API Java 25 → JDBC/PostgreSQL embarcado. A alteração pela interface mudou a recomendação e a restauração recuperou o Caixa 2.
- Ausência de erros JavaScript nos fluxos testados.
- Capturas desktop e celular inspecionadas visualmente para alinhamento e legibilidade.

## Limites
O PostgreSQL 17 nativo do compose não foi iniciado neste ambiente. O teste JDBC com PGlite verifica o fluxo e SQL, mas não cobre operação, autenticação, concorrência ou desempenho de um servidor PostgreSQL completo. A demonstração no celular físico, firewall, QR Code na rede local e instalação em Windows devem ser conferidos na máquina de apresentação.

O pacote contém código-fonte, não inclui JDK, Node, PostgreSQL, node_modules, JAR compilado ou ferramentas usadas apenas para validação. Instale os pré-requisitos e siga o README.
