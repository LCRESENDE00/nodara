# Nodara

Dois sites da marca Nodara, cada um com identidade própria e navegação entre si:

- **Nodara Support** (`support/`): suporte técnico e serviços de TI para empresas e pessoas.
  Editorial e calmo: off-white, títulos em serifa (Instrument Serif), botões arredondados.
- **Nodara Hardware** (`hardware/`): manutenção e reparo de notebooks, desktops, impressoras e
  impressoras 3D. Técnico e preciso: branco, Geist e Geist Mono, cantos retos.

A raiz (`index.html`) é uma entrada mínima da marca que leva às duas áreas.

HTML, CSS e JavaScript modular, sem build e sem dependências.

## Estrutura

```
index.html                 entrada da marca
support/                   Nodara Support: início, servicos/, contato/ (formulário de suporte)
hardware/                  Nodara Hardware: início, servicos/, orcamento/ (formulário de orçamento)
shared/base.css            base comum: tipografia, cabeçalho, rodapé, botões, formulários
shared/nodara.js           <nodara-header>, <nodara-footer>, endereços entre sites, envio dos formulários
support/support.css        identidade do Support
hardware/hardware.css      identidade do Hardware
dev-server.mjs             servidor local que também simula os subdomínios
_redirects                 regras de subdomínio para produção (Netlify)
```

Cada página diz onde está com `<html data-site="support|hardware" data-page="inicio|servicos|contato|orcamento">`.
O cabeçalho mostra a marca, o seletor **Support / Hardware** e as páginas da área atual.

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
