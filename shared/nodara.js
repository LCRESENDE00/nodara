// Nodara: cabeçalho, rodapé, navegação entre sites, animações e formulários.
// Cada página carrega <script type="module" src=".../shared/nodara.js"> e diz onde está com
// <html data-site="marca|support|hardware" data-page="inicio|servicos|contato|orcamento">.

export const CONFIG = {
  // E-mail que recebe os pedidos dos formulários (via FormSubmit). No primeiro envio chega
  // um e-mail de ativação nesse endereço; depois de ativar, os pedidos passam a chegar.
  emailPedidos: '',
  // WhatsApp com DDI e DDD, só números (ex.: 5531999999999). Vazio: o botão flutuante não aparece.
  whatsapp: '',
  cidade: 'Belo Horizonte – MG',
  // Domínios de produção (exemplos: troque pelos registrados).
  dominios: { marca: 'nodara.com.br', support: 'support.nodara.com.br', hardware: 'hardware.nodara.com.br' },
  // Subdomínios para testar localmente com `npm run dev`.
  dominiosLocais: { marca: 'nodara.localhost', support: 'support.localhost', hardware: 'hardware.localhost' },
};

// [destino, âncora, texto, descrição]
const AREAS = {
  support: {
    nome: 'Support',
    sobre: 'Suporte técnico e serviços de TI para empresas e pessoas.',
    servicos: [
      ['support/servicos', '#atendimento', 'Atendimento técnico', 'Remoto e presencial'],
      ['support/servicos', '#infraestrutura', 'Redes e Wi‑Fi', 'Cobertura e estabilidade'],
      ['support/servicos', '#sistemas', 'Sistemas e contas', 'Microsoft 365 e Google Workspace'],
      ['support/servicos', '#seguranca', 'Segurança e backup', 'Dados protegidos e recuperáveis'],
      ['support/servicos', '#empresas', 'Suporte para empresas', 'Acompanhamento mensal'],
    ],
    links: [['support', '#como-funciona', 'Como funciona'], ['support', '#para-quem', 'Para quem']],
    cta: ['support/contato', '', 'Solicitar suporte'],
  },
  hardware: {
    nome: 'Hardware',
    sobre: 'Manutenção, diagnóstico e reparo de equipamentos.',
    servicos: [
      ['hardware/servicos', '#notebooks', 'Notebooks', 'Tela, bateria, placa e upgrades'],
      ['hardware/servicos', '#desktops', 'Desktops', 'Montagem, upgrade e limpeza'],
      ['hardware/servicos', '#impressoras', 'Impressoras', 'Jato de tinta, tanque e laser'],
      ['hardware/servicos', '#impressoras-3d', 'Impressoras 3D', 'Bico, mesa, extrusão e calibração'],
      ['hardware/servicos', '#diagnostico', 'Diagnóstico técnico', 'Laudo e avaliação de reparo'],
    ],
    links: [['hardware', '#processo', 'Como funciona'], ['hardware', '#atendimento', 'Atendimento e garantia']],
    cta: ['hardware/orcamento', '', 'Solicitar orçamento'],
  },
};

// Fotos do Wikimedia Commons usadas nos sites, com autor e licença para os créditos do rodapé.
const LICENCAS = {
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC0': 'https://creativecommons.org/publicdomain/zero/1.0/',
};
const FOTOS = {
  'support-hero': ['Wikimedia Foundation Servers-8055 35.jpg', 'Victor Grigas', 'CC BY-SA 3.0'],
  'support-tecnico': ['Technician with laptop working on server rack at NERSC.jpg', 'Derrick Coetzee', 'CC0'],
  'support-redes': ['Cable closet bh.jpg', 'autor desconhecido', 'Domínio público'],
  'support-sistemas': ['Home-office-336377.jpg', 'Free-Photos (Pixabay)', 'CC0'],
  'support-seguranca': ['Three external hard drives are stacked on a wooden table.jpg', 'Shixart1985', 'CC BY 2.0'],
  'support-empresas': ['Desktop with laptop and calculator (Unsplash).jpg', 'autor desconhecido (Unsplash)', 'CC0'],
  'support-pessoa': ['Woman sits at desk working on laptop in home office.jpg', 'Shixart1985', 'CC BY 2.0'],
  'hardware-hero': ['A computer motherboard is illuminated by a green light, showcasing intricate circuits, capacitors, and connections.jpg', 'Shixart1985', 'CC BY 2.0'],
  'hardware-notebooks': ['Computer repair in progress.jpg', 'Vintechcomputerservices', 'CC BY-SA 4.0'],
  'hardware-desktops': ['2025 Wnętrze komputera PC.jpg', 'Jacek Halicki', 'CC BY-SA 4.0'],
  'hardware-impressoras': ['Xerox AltaLink C8045 photocopier.jpg', 'Baron Maddock', 'CC BY 4.0'],
  'hardware-3d': ['3D printer working on green model parts.jpg', 'Shixart1985', 'CC BY 2.0'],
  'hardware-diagnostico': ['Soldering a 0805.jpg', 'Aisart', 'CC BY-SA 3.0'],
  'hardware-pessoa': ['A Ghanaian Computer Hardware Technician.jpg', 'Amuzujoe', 'CC BY-SA 4.0'],
};
// fotos que cada site mostra (inclui as da outra área usadas no banner que leva até ela)
const FOTOS_DO_SITE = {
  marca: ['support-hero', 'hardware-hero'],
  support: ['support-pessoa', 'support-tecnico', 'support-redes', 'support-sistemas', 'support-seguranca', 'support-empresas', 'hardware-notebooks'],
  hardware: ['hardware-pessoa', 'hardware-notebooks', 'hardware-desktops', 'hardware-impressoras', 'hardware-3d', 'hardware-diagnostico', 'support-redes'],
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

const ICONE = {
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  ir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  fechar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  whats: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>',
};

// Logo da Nodara: o "N" ligando quatro pontos. Os dois pontos coloridos levam a cor da área.
const CORES_LOGO = { marca: ['#5B21B6', '#C2410C'], support: ['#5B21B6', '#5B21B6'], hardware: ['#C2410C', '#C2410C'] };
const CORES_LOGO_CLARAS = { marca: ['#A78BFA', '#FB923C'], support: ['#A78BFA', '#A78BFA'], hardware: ['#FB923C', '#FB923C'] };
function logo(escuro = false) {
  const [a, b] = (escuro ? CORES_LOGO_CLARAS : CORES_LOGO)[site];
  const traco = escuro ? '#fff' : '#0B0A12';
  const area = AREAS[site];
  const rotulo = area ? `Nodara ${area.nome}, ir para a página inicial da Nodara` : 'Nodara, página inicial';
  return `<a class="nd-logo" href="${url('marca')}" aria-label="${rotulo}">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 25V7l18 18V7" fill="none" stroke="${traco}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="7" cy="25" r="3.7" fill="${a}"/><circle cx="7" cy="7" r="3.7" fill="${traco}"/><circle cx="25" cy="25" r="3.7" fill="${traco}"/><circle cx="25" cy="7" r="3.7" fill="${b}"/></svg>
      <b>Nodara</b>${area ? `<span class="nd-area">${area.nome}</span>` : ''}
    </a>`;
}

const seletor = () => `
  <nav class="nd-switch" aria-label="Sites Nodara">
    <a href="${url('support')}"${atual(site === 'support')}><span class="dot dot-support" aria-hidden="true"></span>Support</a>
    <a href="${url('hardware')}"${atual(site === 'hardware')}><span class="dot dot-hardware" aria-hidden="true"></span>Hardware</a>
  </nav>`;

// ---------- <nodara-header> ----------
class NodaraHeader extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    const area = AREAS[site];
    let nav, direita, painel;
    if (area) {
      const [cd, ch, ct] = area.cta;
      const itens = area.servicos.map(([d, h, t, s]) => `<a href="${url(d, h)}"><span>${t}</span><small>${s}</small></a>`).join('');
      nav = `
        <div class="nd-drop">
          <button type="button" aria-expanded="false" aria-controls="nd-servicos">Serviços ${ICONE.seta}</button>
          <div class="nd-menu" id="nd-servicos">${itens}<a class="all" href="${url(site + '/servicos')}"><span>Ver todos os serviços</span>${ICONE.ir}</a></div>
        </div>
        ${area.links.map(([d, h, t]) => `<a href="${url(d, h)}">${t}</a>`).join('')}`;
      direita = `${seletor()}<a class="btn btn-primary btn-sm" href="${url(cd, ch)}"${atual(cd === site + '/' + pagina)}>${ct}</a>`;
      painel = `
        <div class="group"><span>Serviços</span>${area.servicos.map(([d, h, t]) => `<a class="item" href="${url(d, h)}">${t}</a>`).join('')}
          <a class="item" href="${url(site + '/servicos')}">Ver todos os serviços</a></div>
        ${area.links.map(([d, h, t]) => `<a class="top-item" href="${url(d, h)}">${t}</a>`).join('')}
        ${seletor()}
        <a class="btn btn-primary" href="${url(cd, ch)}">${ct}</a>`;
    } else {
      const links = `<a href="${url('support')}"><span class="dot dot-support" aria-hidden="true"></span>Nodara Support</a><a href="${url('hardware')}"><span class="dot dot-hardware" aria-hidden="true"></span>Nodara Hardware</a>`;
      nav = links;
      direita = '';
      painel = links.replaceAll('<a ', '<a class="top-item" ');
    }

    this.innerHTML = `
      <a href="#conteudo" class="skip">Pular para o conteúdo</a>
      <header class="nd-header">
        <div class="wrap nd-bar">
          ${logo()}
          <nav class="nd-nav" aria-label="Principal">${nav}</nav>
          <div class="nd-right">
            ${direita}
            <button type="button" class="nd-burger" aria-expanded="false" aria-controls="nd-panel" aria-label="Abrir menu">${ICONE.menu}</button>
          </div>
        </div>
        <div class="nd-panel" id="nd-panel">${painel}</div>
      </header>`;

    const header = this.querySelector('.nd-header');
    addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 8), { passive: true });

    // menu "Serviços"
    const drop = this.querySelector('.nd-drop button');
    const menu = this.querySelector('.nd-menu');
    const fecharMenu = () => { if (!drop) return; drop.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); };
    drop?.addEventListener('click', () => {
      const abrir = drop.getAttribute('aria-expanded') !== 'true';
      drop.setAttribute('aria-expanded', String(abrir));
      menu.classList.toggle('open', abrir);
    });
    menu?.addEventListener('click', (e) => { if (e.target.closest('a')) fecharMenu(); });

    // menu do celular
    const burger = this.querySelector('.nd-burger');
    const panel = this.querySelector('.nd-panel');
    const fecharPainel = () => { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); burger.innerHTML = ICONE.menu; panel.classList.remove('open'); };
    burger.addEventListener('click', () => {
      const abrir = !panel.classList.contains('open');
      panel.classList.toggle('open', abrir);
      burger.setAttribute('aria-expanded', String(abrir));
      burger.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
      burger.innerHTML = abrir ? ICONE.fechar : ICONE.menu;
    });
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) fecharPainel(); });

    document.addEventListener('click', (e) => { if (drop && !e.target.closest('.nd-drop')) fecharMenu(); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (menu?.classList.contains('open')) { fecharMenu(); drop.focus(); }
      if (panel.classList.contains('open')) { fecharPainel(); burger.focus(); }
    });
  }
}

// ---------- <nodara-footer> ----------
class NodaraFooter extends HTMLElement {
  connectedCallback() {
    if (this.firstElementChild) return;
    const area = AREAS[site];
    const li = (d, h, t) => `<li><a href="${url(d, h)}">${t}</a></li>`;
    const contatos = [
      CONFIG.emailPedidos && `<li><a href="mailto:${CONFIG.emailPedidos}">${CONFIG.emailPedidos}</a></li>`,
      CONFIG.whatsapp && `<li><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>`,
    ].filter(Boolean).join('');
    const creditos = FOTOS_DO_SITE[site].map((k) => {
      const [arquivo, autor, licenca] = FOTOS[k];
      const pagina = 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(arquivo.replace(/ /g, '_'));
      const lic = LICENCAS[licenca] ? `<a href="${LICENCAS[licenca]}" target="_blank" rel="noopener">${licenca}</a>` : licenca;
      return `<li><a href="${pagina}" target="_blank" rel="noopener">${arquivo.replace(/\.\w+$/, '')}</a> · ${autor} · ${lic}</li>`;
    }).join('');
    const cta = area ? `<a class="btn btn-white btn-sm cta" href="${url(area.cta[0])}">${area.cta[2]}</a>` : '';

    this.innerHTML = `
      <footer class="nd-footer">
        <div class="wrap top">
          <div>
            ${logo(true)}
            <p class="about">${area ? area.sobre : 'Suporte de TI e manutenção de equipamentos para empresas e pessoas.'} ${CONFIG.cidade}.</p>
            ${cta}
          </div>
          <nav aria-labelledby="ft-support"><h2 id="ft-support"><span class="dot dot-support" aria-hidden="true"></span>Nodara Support</h2><ul>
            ${li('support', '', 'Início')}${li('support/servicos', '', 'Serviços')}${li('support', '#como-funciona', 'Como funciona')}${li('support/contato', '', 'Solicitar suporte')}
          </ul></nav>
          <nav aria-labelledby="ft-hardware"><h2 id="ft-hardware"><span class="dot dot-hardware" aria-hidden="true"></span>Nodara Hardware</h2><ul>
            ${li('hardware', '', 'Início')}${li('hardware/servicos', '', 'Serviços')}${li('hardware', '#processo', 'Como funciona')}${li('hardware/orcamento', '', 'Solicitar orçamento')}
          </ul></nav>
          <nav aria-labelledby="ft-nodara"><h2 id="ft-nodara">Nodara</h2><ul>
            ${li('marca', '', 'Página inicial')}${contatos}
          </ul></nav>
        </div>
        <div class="wrap bottom">
          <span>© ${new Date().getFullYear()} Nodara · ${CONFIG.cidade}</span>
          <details><summary>Créditos das fotos (Wikimedia Commons)</summary><ul>${creditos}</ul></details>
        </div>
      </footer>
      ${CONFIG.whatsapp ? `<a class="whats" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" aria-label="Conversar pelo WhatsApp">${ICONE.whats}</a>` : ''}`;
  }
}

customElements.define('nodara-header', NodaraHeader);
customElements.define('nodara-footer', NodaraFooter);

// ---------- links escritos no HTML ----------
// <a href="../hardware/servicos/#notebooks" data-nd="hardware/servicos" data-nd-hash="#notebooks">: o href relativo
// já funciona por pastas; aqui ele vira o endereço certo do ambiente (subdomínio, file://).
for (const a of document.querySelectorAll('a[data-nd]')) {
  a.href = url(a.dataset.nd, a.dataset.ndHash || '');
}

// ---------- entrada suave ao rolar ----------
const revelar = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((itens) => {
    for (const item of itens) if (item.isIntersecting) { item.target.classList.add('in'); io.unobserve(item.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
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
