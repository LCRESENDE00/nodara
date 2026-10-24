// Nodara: navegação e componentes comuns aos dois sites.
// Cada página carrega <script type="module" src=".../shared/nodara.js"> e diz onde está com
// <html data-site="marca|support|hardware" data-page="inicio|servicos|contato|orcamento">.

export const CONFIG = {
  // E-mail que recebe os pedidos dos formulários (via FormSubmit). No primeiro envio chega
  // um e-mail de ativação nesse endereço; depois de ativar, os pedidos passam a chegar.
  emailPedidos: '',
  cidade: 'Belo Horizonte – MG',
  // Domínios de produção (exemplos: troque pelos registrados).
  dominios: { marca: 'nodara.com.br', support: 'support.nodara.com.br', hardware: 'hardware.nodara.com.br' },
  // Subdomínios para testar localmente com `npm run dev`.
  dominiosLocais: { marca: 'nodara.localhost', support: 'support.localhost', hardware: 'hardware.localhost' },
};

const AREAS = {
  support: {
    nome: 'Support',
    paginas: [['servicos', 'Serviços'], ['contato', 'Solicitar suporte']],
  },
  hardware: {
    nome: 'Hardware',
    paginas: [['servicos', 'Serviços'], ['orcamento', 'Solicitar orçamento']],
  },
};

// ---------- endereços ----------
// "producao" e "local": um subdomínio por site. "caminho": tudo num endereço só, em pastas
// (/, /support/, /hardware/), como no GitHub Pages, em file:// ou em qualquer servidor estático.
const raiz = new URL('../', import.meta.url);
const host = location.hostname.replace(/^www\./, '');
const temHost = (mapa) => Object.values(mapa).includes(host);
export const modo = temHost(CONFIG.dominios) ? 'producao' : temHost(CONFIG.dominiosLocais) ? 'local' : 'caminho';

// destino: "marca", "support", "support/servicos", "hardware/orcamento"...
export function url(destino, hash = '') {
  const [area, pagina] = destino.split('/');
  const caminho = pagina ? pagina + '/' : '';
  let u;
  if (modo === 'caminho') {
    u = new URL((area === 'marca' ? '' : area + '/') + caminho, raiz).href;
    if (location.protocol === 'file:') u += 'index.html';
  } else {
    const hosts = modo === 'producao' ? CONFIG.dominios : CONFIG.dominiosLocais;
    u = `${location.protocol}//${hosts[area]}${location.port ? ':' + location.port : ''}/${caminho}`;
  }
  return u + hash;
}

const site = document.documentElement.dataset.site || 'marca';
const pagina = document.documentElement.dataset.page || 'inicio';
const atual = (cond) => (cond ? ' aria-current="page"' : '');

// ---------- <nodara-header> ----------
class NodaraHeader extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    const area = AREAS[site];
    const paginas = area.paginas
      .map(([chave, texto], i) => {
        const cta = i === area.paginas.length - 1 ? ' class="nd-cta"' : '';
        return `<a href="${url(site + '/' + chave)}"${cta}${atual(pagina === chave)}>${texto}</a>`;
      })
      .join('');
    this.innerHTML = `
      <a href="#conteudo" class="skip">Pular para o conteúdo</a>
      <header class="nd-header">
        <div class="wrap">
          <a href="${url('marca')}" class="nd-mark" aria-label="Nodara, página inicial">NODARA</a>
          <nav class="nd-switch" aria-label="Sites Nodara">
            <a href="${url('support')}"${atual(site === 'support')}>Support</a>
            <a href="${url('hardware')}"${atual(site === 'hardware')}>Hardware</a>
          </nav>
          <nav class="nd-pages" aria-label="${area.nome}">
            <a href="${url(site)}"${atual(pagina === 'inicio')}>Início</a>${paginas}
          </nav>
        </div>
      </header>`;
  }
}

// ---------- <nodara-footer> ----------
class NodaraFooter extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    const email = CONFIG.emailPedidos ? `<a href="mailto:${CONFIG.emailPedidos}">${CONFIG.emailPedidos}</a>` : '';
    this.innerHTML = `
      <footer class="nd-footer">
        <div class="wrap">
          <span>© ${new Date().getFullYear()} Nodara · ${CONFIG.cidade}</span>
          <nav aria-label="Sites Nodara">
            <a href="${url('support')}">Nodara Support</a>
            <a href="${url('hardware')}">Nodara Hardware</a>
            ${email}
          </nav>
        </div>
      </footer>`;
  }
}

customElements.define('nodara-header', NodaraHeader);
customElements.define('nodara-footer', NodaraFooter);

// ---------- links escritos no HTML ----------
// <a href="../hardware/orcamento/" data-nd="hardware/orcamento">: o href relativo já funciona por
// pastas; aqui ele vira o endereço certo do ambiente (subdomínio, file://).
for (const a of document.querySelectorAll('a[data-nd]')) {
  a.href = url(a.dataset.nd, a.dataset.ndHash || '');
}

// ---------- entrada suave ao rolar ----------
const revelar = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((itens) => {
    for (const item of itens) if (item.isIntersecting) { item.target.classList.add('in'); io.unobserve(item.target); }
  }, { rootMargin: '0px 0px -6% 0px' });
  revelar.forEach((el) => io.observe(el));
} else {
  revelar.forEach((el) => el.classList.add('in'));
}

// ---------- formulários: envio real por e-mail (FormSubmit) ----------
// <form data-form="Solicitação de suporte"> com campos name="nome", "email"...; o campo "_honey" é armadilha para robôs.
for (const form of document.querySelectorAll('form[data-form]')) {
  const status = form.querySelector('.form-status');
  const botao = form.querySelector('button[type="submit"]');
  const pronto = form.parentElement.querySelector('.form-done');
  const textoBotao = botao.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    if (!form.reportValidity()) return;

    const dados = Object.fromEntries(new FormData(form));
    if (dados._honey) return concluir();
    delete dados._honey;

    if (!CONFIG.emailPedidos) {
      return erro('O envio ainda não foi configurado neste site.');
    }

    const area = site === 'support' ? 'Nodara Support' : 'Nodara Hardware';
    const assunto = `[${area}] ${form.dataset.form} – ${dados.nome}`;
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    try {
      const resposta = await fetch(`https://formsubmit.co/ajax/${CONFIG.emailPedidos}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ Área: area, ...dados, _subject: assunto, _template: 'table', _captcha: 'false' }),
      });
      const json = await resposta.json().catch(() => ({}));
      if (!resposta.ok || String(json.success) !== 'true') throw new Error(json.message || resposta.status);
      concluir();
    } catch (falha) {
      console.error('Nodara: falha no envio do formulário', falha);
      const corpo = Object.entries(dados).map(([k, v]) => `${k}: ${v}`).join('\n');
      erro(`Não foi possível enviar agora. <a href="mailto:${CONFIG.emailPedidos}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}">Envie por e-mail</a> ou tente de novo em instantes.`);
    } finally {
      botao.disabled = false;
      botao.textContent = textoBotao;
    }
  });

  function erro(html) {
    status.className = 'form-status erro';
    status.innerHTML = html;
  }

  function concluir() {
    form.reset();
    form.hidden = true;
    pronto.hidden = false;
    pronto.querySelector('h2').focus();
  }

  pronto.querySelector('button').addEventListener('click', () => {
    pronto.hidden = true;
    form.hidden = false;
    form.querySelector('input, select, textarea').focus();
  });
}
