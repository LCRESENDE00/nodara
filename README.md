# Nodara

Dois sites da marca Nodara, com o mesmo sistema visual e navegação entre si:

- **Nodara Support** (`support/`): suporte técnico e serviços de TI para empresas e pessoas. Roxo.
- **Nodara Hardware** (`hardware/`): manutenção e reparo de notebooks, desktops, impressoras e
  impressoras 3D. Laranja.

A raiz (`index.html`) é a entrada da marca, com as duas áreas lado a lado.

A estrutura das páginas segue a de sites de empresas de tecnologia (abertura forte, serviços em
destaque, compromissos, processo, dúvidas e chamada final), com a identidade da Nodara: preto, branco
e a cor de cada área, o logo do "N" com quatro pontos, Plus Jakarta Sans e rótulos em IBM Plex Mono.

HTML, CSS e JavaScript modular, sem build e sem dependências.

## Fotos

As fotos vêm do [Wikimedia Commons](https://commons.wikimedia.org), com licenças CC0, domínio público,
CC BY e CC BY-SA. Autor e licença de cada uma aparecem em "Créditos das fotos", no rodapé de cada site,
e ficam listados no objeto `FOTOS` de `shared/nodara.js`. Ao trocar uma foto, atualize os dois lugares.

## Estrutura

```
index.html                 entrada da marca
support/                   Nodara Support: início, servicos/, contato/ (formulário de suporte)
hardware/                  Nodara Hardware: início, servicos/, orcamento/ (formulário de orçamento)
shared/base.css            sistema visual comum: cabeçalho, abertura, grade de serviços, seções, formulários, rodapé
shared/nodara.js           <nodara-header>, <nodara-footer>, menus, endereços entre sites, formulários
support/support.css        cores do Support (e as do Hardware, para o banner que leva até ele)
hardware/hardware.css      cores do Hardware (e as do Support)
dev-server.mjs             servidor local que também simula os subdomínios
_redirects                 regras de subdomínio para produção (Netlify)
```

Cada página diz onde está com `<html data-site="support|hardware" data-page="inicio|servicos|contato|orcamento">`.
O cabeçalho mostra a marca, o menu **Serviços** da área atual, os atalhos da página inicial, o seletor
**Support / Hardware** e o botão de pedido. No celular, tudo isso fica no menu.

Se `whatsapp` for preenchido em `CONFIG` (`shared/nodara.js`), aparece o botão flutuante do WhatsApp e o
link no rodapé.

## Formulários

Os formulários enviam os pedidos por e-mail com o [FormSubmit](https://formsubmit.co), sem servidor próprio.

1. Preencha `emailPedidos` no início de `shared/nodara.js`.
2. Envie um pedido de teste pelo site: chega um e-mail de ativação nesse endereço.
3. Clique em ativar. A partir daí, cada pedido chega por e-mail, com a área (Support ou Hardware)
   no assunto e o e-mail do visitante como endereço de resposta.

Enquanto `emailPedidos` estiver vazio, os formulários avisam que o envio não foi configurado.

## Rodando localmente

```bash
npm run dev
```

- `http://localhost:5173/`: tudo em pastas, como no GitHub Pages
- `http://support.localhost:5173/` e `http://hardware.localhost:5173/`: um subdomínio por site, como em produção

## Publicação

- **GitHub Pages**: publica a branch `main`; os sites ficam em `/support/` e `/hardware/`.
- **Subdomínios** (`support.nodara.com.br`, `hardware.nodara.com.br`, exemplos): publique o
  repositório num projeto do Netlify, aponte os domínios para ele e ajuste `_redirects` e
  `CONFIG.dominios` em `shared/nodara.js`.
