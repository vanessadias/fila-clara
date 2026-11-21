# Checklist da segunda entrega
- [ ] Instalar JDK 25 e PostgreSQL; executar com o README.
- [ ] Revisar a jornada selecionada e justificar o uso de dados simulados.
- [ ] Explicar arquitetura, tabela e fórmula de estimativa.
- [ ] Executar testes locais e registrar os resultados.
- [ ] Capturar tela no computador e no celular.
- [ ] Reproduzir a mudança da recomendação.
- [ ] Verificar fila vazia, empate, todos fechados, negativos e falha de API.
- [ ] Reiniciar o backend e confirmar persistência.
- [ ] Preencher o template oficial do Blackboard.
- [ ] Subir frontend e backend no GitHub e incluir integrantes.
- [ ] Revisar README e instruções em outra máquina.
- [ ] Gravar vídeo até 60 segundos e conferir acesso do professor.
- [ ] Submeter links e documento no Blackboard.

## Roteiro de vídeo
0–10 s: apresentar o problema da escolha da fila e a PoC com dados simulados.
10–25 s: mostrar o Caixa 2 recomendado apesar de ter mais pessoas.
25–40 s: alterar os produtos do Caixa 2 para 100 na simulação.
40–50 s: mostrar a recomendação atualizada para Caixa 3.
50–60 s: apresentar Java, React e PostgreSQL e esclarecer ausência de sensores reais.

## Testes manuais a registrar
| Caso | Resultado esperado | Resultado observado |
|---|---|---|
| Cenário inicial | Caixa 2, 240 segundos | A preencher |
| Caixa 2 com 100 produtos | Caixa 3 | A preencher |
| Todos fechados | Sem recomendação | A preencher |
| Empate | Menor número | A preencher |
| Aberto com 0 pessoas e 0 produtos | Zero segundos | A preencher |
| PATCH negativo ou produtos sem pessoas | HTTP 400 | A preencher |
| Caixa inexistente | HTTP 404 | A preencher |
| Banco/backend desligado | Aviso de falha na tela | A preencher |
| Reiniciar backend | Dados preservados | A preencher |
| QR na mesma rede | Página abre no celular | A preencher |
