# Versões verificadas

Atualização em 04/11/2026.

| Componente | Versão | Definição |
|---|---|---|
| Java | 25 | pom.xml e .java-version |
| JDK usado nos testes | Zulu 25.0.5.0.3 | Build e execução reais com Java 25 |
| Spring Boot | 4.1.2 | Parent Maven |
| Spring Web MVC | 7.0.10 | Gerenciado pelo Spring Boot |
| Hibernate ORM | 7.4.13.Final | Gerenciado pelo Spring Boot |
| Driver PostgreSQL | 42.7.14 | Gerenciado pelo Spring Boot |
| Jackson Databind | 3.1.7 | Gerenciado pelo Spring Boot |
| Hibernate Validator | 9.1.5.Final | Gerenciado pelo Spring Boot |
| Maven | 3.9.11 | Maven Wrapper 3.3.4 |
| PostgreSQL local recomendado | 17 | compose.yaml |
| React e React DOM | 19.3.1 | Versões iguais e fixadas |
| Tipos React e React DOM | 19.3.0 | Mesma linha do React |
| Tailwind CSS e plugin Vite | 4.3.4 | Versões iguais e fixadas |
| Vite | 7.3.7 | Versão fixada |
| Plugin React para Vite | 5.2.0 | Versão fixada |
| TypeScript | 5.9.3 | Versão fixada |
| QR Code | 1.5.4 | Versão fixada |
| Node usado no build | 24.22.1 | Linha 24 recomendada em .nvmrc |

## Resolução
O parent do Spring Boot gerencia as versões transitivas do backend. Não foram sobrescritas versões individuais de Spring, Hibernate, Jackson ou JDBC. A árvore completa resolvida está em dependency-tree.txt.

No frontend, package.json e package-lock.json fixam a instalação. `npm ls --all` não apontou dependências inválidas ou ausentes obrigatórias. As entradas opcionais específicas de outras plataformas não precisam ser instaladas.

O JDK não vem dentro do ZIP. Configure JAVA_HOME para o JDK 25 e confira `java -version` e `mvnw -v`. Node e PostgreSQL também são pré-requisitos.

## Referências
- https://docs.spring.io/spring-boot/system-requirements.html
- https://tailwindcss.com/docs/installation/using-vite
- https://vite.dev/guide/

O teste de integração usou o protocolo PostgreSQL via PGlite, exclusivamente no ambiente de validação. PGlite não é dependência do projeto entregue e não substitui o PostgreSQL da aplicação. Veja VALIDACAO.md para o alcance dos testes.
