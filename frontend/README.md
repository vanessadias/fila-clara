# Frontend Fila Clara
Guia completo de instalação, regras e entrega: `../backend/README.md`.

Execute o backend e o PostgreSQL primeiro. Depois, nesta pasta:
```sh
npm ci
npm run dev
```
React 19 + TypeScript + Tailwind CSS 4. Vite faz proxy de /api para localhost:8080. Build: `npm run build`.

As cores comparam os tempos dos caixas abertos: verde para a menor espera, vermelho para a maior e amarelo para as demais. Empates recebem a mesma cor; se todos tiverem o mesmo tempo, todos ficam verdes. Caixas fechados ou sem estimativa não são classificados. A comparação é refeita a cada atualização.

Para testar essa classificação no Windows: `node --experimental-strip-types --test tests\queueWait.test.mjs`.

## Instalação reproduzível
Use Node 24 LTS e `npm ci`. As versões do package.json são exatas e o lock inclui as dependências transitivas. Não é necessário recriar o projeto com um gerador.

Para criar uma nova base com a mesma ferramenta (não execute sobre a pasta entregue):
```sh
npm create vite@7 frontend -- --template react-ts
```
Depois use o package.json, package-lock.json e vite.config.ts deste pacote e rode `npm ci` para reproduzir as versões verificadas.

A configuração oficial do Tailwind 4 usa o plugin @tailwindcss/vite e `@import "tailwindcss"` no CSS. Não requer o fluxo antigo de `tailwindcss init -p`.
