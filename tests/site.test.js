import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

const root = new URL('../public/', import.meta.url);

async function page(setup = () => {}) {
  const dom = new JSDOM(await readFile(new URL('index.html', root), 'utf8'), { runScripts: 'outside-only', url: 'https://example.test' });
  setup(dom.window);
  dom.window.eval(await readFile(new URL('main.js', root), 'utf8'));
  return dom;
}

test('mobile navigation opens, closes with Escape and returns focus', async () => {
  const dom = await page();
  const { document, KeyboardEvent } = dom.window;
  const button = document.querySelector('.menu-toggle');
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.equal(document.querySelector('#navigation').classList.contains('is-open'), true);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(document.activeElement, button);
  dom.window.close();
});

test('choosing a navigation destination closes the mobile menu', async () => {
  const dom = await page();
  const { document } = dom.window;
  document.querySelector('.menu-toggle').click();
  document.querySelector('#navigation a').click();
  assert.equal(document.querySelector('.menu-toggle').getAttribute('aria-expanded'), 'false');
  assert.equal(document.querySelector('#navigation').classList.contains('is-open'), false);
  dom.window.close();
});

test('all local links and assets exist, including anchor destinations', async () => {
  for (const filename of ['index.html', 'privacidade.html', '404.html']) {
    const dom = new JSDOM(await readFile(new URL(filename, root), 'utf8'));
    const { document } = dom.window;
    assert.equal(document.documentElement.lang, 'pt-BR');
    assert.equal(document.querySelectorAll('h1').length, 1);
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
    for (const el of document.querySelectorAll('[href], [src]')) {
      const value = el.getAttribute('href') ?? el.getAttribute('src');
      assert.ok(value && value !== '#', 'No placeholder links');
      if (value.startsWith('#')) assert.ok(document.getElementById(value.slice(1)), value);
      else if (!/^(https?:|mailto:|tel:|data:)/.test(value)) {
        await access(new URL(value.split('#')[0].replace(/^\//, '') || 'index.html', root));
      }
      if (el.tagName === 'IMG') {
        assert.ok(el.hasAttribute('alt'));
        assert.ok(el.hasAttribute('width') && el.hasAttribute('height'));
      }
    }
    dom.window.close();
  }
});

test('contact and structured data use the researched business details', async () => {
  const dom = await page();
  const { document } = dom.window;
  const data = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(data['@type'], 'AutoRepair');
  assert.equal(data.telephone, '+5511950295595');
  assert.equal(data.openingHours, 'Mo-Fr 08:00-17:00');
  assert.match(data.description, /Mais de 22 anos de experiência/);
  assert.match(document.querySelector('#especialidade').textContent, /Mais de 22 anos de experiência/);
  assert.match(document.querySelector('#especialidade').textContent, /diversas outras marcas/);
  for (const term of ['preditiva', 'preventiva', 'corretiva', 'correia', 'elétrica', 'câmbio', 'freios', 'suspensão', 'óleo', 'filtros']) {
    assert.ok(document.querySelector('#servicos').textContent.includes(term), `Missing requested service: ${term}`);
    assert.ok(data.description.includes(term), `Missing structured service: ${term}`);
  }
  assert.ok([...document.querySelectorAll('.contact-value')].some(el => el.innerHTML === 'Segunda a sexta<br>08h às 17h'));
  assert.ok(document.querySelector('a[href="tel:+5511950295595"]'));
  assert.ok(document.querySelector('a[href^="mailto:oficina@rofacar.com.br"]'));
  const whatsappLinks = [...document.querySelectorAll('a[href*="wa.me"]')];
  assert.ok(whatsappLinks.length >= 3, 'WhatsApp must be available in the main contact entry points');
  for (const link of whatsappLinks) {
    assert.equal(link.href, 'https://wa.me/5511950295595', 'Use only the confirmed WhatsApp number, without tracking');
    assert.ok(link.relList.contains('noopener'));
  }
  assert.equal(document.querySelectorAll('a[href="tel:+551150295595"]').length, 0, 'Prefer the current contact supplied by the user');
  assert.match(document.querySelector('#especialidade').textContent, /Jumpy, Peugeot Expert e Fiat Scudo/);
  assert.ok(document.querySelector('a[href="https://www.instagram.com/rofacarservice/"]'), 'Use the profile supplied by the owner');
  assert.equal(document.querySelectorAll('form').length, 0, 'No collection forms');
  assert.ok(document.querySelector('meta[name="description"]').content.length > 80);
  assert.ok((await stat(new URL('assets/hero.webp', root))).size < 200_000);
  dom.window.close();
});

test('deployment exposes only the public directory and applies browser protections', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.outputDirectory, 'public');
  assert.equal(config.framework, null);
  assert.ok(config.headers[0].headers.some(header => header.key === 'Content-Security-Policy'));
  const policy = config.headers[0].headers.find(header => header.key === 'Content-Security-Policy').value;
  assert.ok(policy.includes("frame-src https://www.google.com/maps/embed;"));
  assert.ok(policy.includes("media-src 'self';"));
  assert.ok(policy.includes("script-src 'self';"));
});

test('three local players load on demand and starting one pauses the others', async () => {
  const dom = await page();
  const { document, Event } = dom.window;
  const videos = [...document.querySelectorAll('.reel-player video')];
  assert.equal(videos.length, 3);
  assert.equal(document.querySelectorAll('.reel-grid iframe, button[data-reel], .reel-external').length, 0);
  const paused = [];
  for (const video of videos) {
    video.pause = () => paused.push(video);
    assert.ok(video.controls && video.playsInline);
    assert.equal(video.preload, 'none');
    assert.equal(video.autoplay, false);
    assert.ok(document.getElementById(video.getAttribute('aria-labelledby')));
    await access(new URL(video.querySelector('source').getAttribute('src').slice(1), root));
    await access(new URL(video.getAttribute('poster').slice(1), root));
  }
  videos[1].dispatchEvent(new Event('play'));
  assert.deepEqual(paused, [videos[0], videos[2]]);
  dom.window.close();
});

test('reduced motion does not set up scroll reveals', async () => {
  const preference = { matches: true, addEventListener(_event, callback) { this.change = callback; } };
  const dom = await page(window => {
    window.matchMedia = () => preference;
    window.IntersectionObserver = class { constructor() { throw new Error('No observer with reduced motion'); } };
  });
  const { document } = dom.window;
  assert.ok(document.querySelector('#brand-track'));
  assert.ok(document.querySelector('#services-title').textContent.length > 10);
  dom.window.close();
});

test('scroll entry reveals content once and reduced motion disconnects observation', async () => {
  let observer;
  const preference = { matches: false, addEventListener(_event, callback) { this.change = callback; } };
  const dom = await page(window => {
    const blocks = window.document.querySelectorAll('[data-reveal]');
    blocks[0].getBoundingClientRect = () => ({ top: window.innerHeight + 100 });
    blocks[1].getBoundingClientRect = () => ({ top: 100 });
    blocks[2].getBoundingClientRect = () => ({ top: window.innerHeight + 500 });
    window.matchMedia = () => preference;
    window.IntersectionObserver = class {
      targets = new Set();
      constructor(callback) { this.callback = callback; observer = this; }
      observe(target) { this.targets.add(target); }
      unobserve(target) { this.targets.delete(target); }
      disconnect() { this.targets.clear(); }
    };
  });
  assert.ok(observer, 'Scroll reveal observer must be configured');
  const target = dom.window.document.querySelector('[data-reveal]');
  assert.ok(target.classList.contains('reveal-ready'), 'Offscreen content is prepared before entering the viewport');
  assert.equal(dom.window.document.querySelectorAll('[data-reveal]')[1].classList.contains('reveal-ready'), false, 'Visible text must not disappear on load');
  observer.callback([{ target, isIntersecting: false }]);
  assert.equal(target.classList.contains('is-revealed'), false);
  observer.callback([{ target, isIntersecting: true }]);
  assert.ok(target.classList.contains('is-revealed'));
  assert.equal(observer.targets.has(target), false);
  preference.matches = true;
  preference.change();
  assert.equal(observer.targets.size, 0);
  assert.equal(dom.window.document.querySelectorAll('.reveal-ready').length, 0, 'Reduced motion restores even unrevealed content');
  dom.window.close();
});

test('WhatsApp is a labeled floating link and replaces the oversized contact number', async () => {
  const dom = await page();
  const { document } = dom.window;
  const floating = document.querySelector('.whatsapp-float');
  assert.ok(floating);
  assert.equal(floating.href, 'https://wa.me/5511950295595');
  assert.match(floating.getAttribute('aria-label'), /WhatsApp/);
  assert.ok(floating.querySelector('img'));
  assert.match(document.querySelector('.contact-top .button').textContent, /WhatsApp/);
  assert.equal(document.querySelector('.contact-phone, .image-note'), null);
  dom.window.close();
});


test('footer presents address, lazy Google map and a complete B9S credit link', async () => {
  const dom = await page();
  const footer = dom.window.document.querySelector('.site-footer');
  assert.match(footer.querySelector('address').textContent, /707a/);
  assert.equal(dom.window.document.querySelectorAll('#localizacao').length, 1);
  const map = footer.querySelector('iframe');
  assert.equal(new URL(map.src).origin, 'https://www.google.com');
  assert.equal(new URL(map.src).pathname, '/maps/embed');
  assert.equal(map.getAttribute('loading'), 'lazy');
  assert.match(map.title, /Localização da Rofacar/);
  assert.ok(map.src.includes('0x94ce5558a059a28f%3A0x24389312d59c00d2'));
  assert.match(footer.textContent, /Copyright © 2026 Rofacar Serviços Automotivos/);
  const credit = footer.querySelector('.footer-credit');
  assert.equal(credit.textContent, 'Criado por B9S');
  assert.equal(credit.href, 'https://b9s.com.br/');
  assert.ok(credit.relList.contains('noopener'));
  dom.window.close();
});
