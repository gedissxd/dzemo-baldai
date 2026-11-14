/* Džemo baldai – svetainės scenarijai (be išorinių bibliotekų) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     NUSTATYMAI
     formEndpoint – adresas, kuriuo siunčiama užklausos forma (POST, multipart/form-data).
     Pvz. Formspree / Web3Forms / Getform adresas arba nuosavas serverio scenarijus.
     Kol reikšmė tuščia, forma NIEKO nesiunčia ir lankytojui parodo aiškų pranešimą.
     ------------------------------------------------------------------ */
  var CONFIG = {
    formEndpoint: 'https://formspree.io/f/mwlovakk',
    maxFileMB: 10
  };

  var lang = document.documentElement.lang === 'en' ? 'en' : 'lt';
  var T = {
    lt: {
      sending: 'Siunčiama…',
      ok: 'Ačiū! Jūsų užklausa išsiųsta – netrukus su Jumis susisieksime.',
      error: 'Užklausos išsiųsti nepavyko. Pabandykite dar kartą arba paskambinkite (8-655) 42501.',
      notConnected: 'Forma dar neprijungta prie el. pašto. Kol kas paskambinkite (8-655) 42501.',
      okNoFile: 'Ačiū! Užklausa išsiųsta, tačiau failo pridėti nepavyko – paprašysime jo susisiekę.',
      tooBig: 'Failas per didelis (daugiausia {n} MB): ',
      empty: 'Šioje kategorijoje darbų dar nėra.'
    },
    en: {
      sending: 'Sending…',
      ok: 'Thank you! Your request has been sent – we will get back to you shortly.',
      error: 'The request could not be sent. Please try again or call +370 655 42501.',
      notConnected: 'The form is not connected to an inbox yet. For now, please call +370 655 42501.',
      okNoFile: 'Thank you! Your request was sent, but the file could not be attached – we will ask for it when we contact you.',
      tooBig: 'File is too large (max {n} MB): ',
      empty: 'No projects in this category yet.'
    }
  }[lang];

  /* ---------- Mobilus meniu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* ---------- Antraštės linija slenkant ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Metai poraštėje ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Baldų tipo parinkimas iš kortelės ---------- */
  var typeSelect = document.getElementById('f-type');
  document.querySelectorAll('[data-type]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeSelect) typeSelect.value = link.getAttribute('data-type');
    });
  });

  /* ---------- Darbų filtras ---------- */
  var filters = document.querySelectorAll('.filter');
  var works = document.querySelectorAll('.work');
  var empty = document.querySelector('.works__empty');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      var shown = 0;
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      works.forEach(function (w) {
        var match = cat === 'all' || w.getAttribute('data-cat') === cat;
        w.hidden = !match;
        if (match) shown++;
      });
      if (empty) { empty.hidden = shown > 0; empty.textContent = T.empty; }
    });
  });

  /* ---------- Nuotraukos padidinimas ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('p');
    document.querySelectorAll('.work__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        var cap = btn.closest('.work').querySelector('figcaption');
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : '';
        lightbox.showModal();
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lightbox__close')) lightbox.close();
    });
  }

  /* ---------- Užklausos forma ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = form.querySelector('.form__status');
    var fileInput = form.querySelector('input[type="file"]');
    var fileList = form.querySelector('.upload__list');
    var submit = form.querySelector('button[type="submit"]');
    var submitLabel = submit.textContent;
    var maxBytes = CONFIG.maxFileMB * 1024 * 1024;

    var setStatus = function (kind, text) {
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
      status.textContent = text || '';
    };

    var tooBig = function () {
      return Array.prototype.filter.call(fileInput.files, function (f) { return f.size > maxBytes; });
    };

    fileInput.addEventListener('change', function () {
      fileList.innerHTML = '';
      Array.prototype.forEach.call(fileInput.files, function (f) {
        var li = document.createElement('li');
        li.textContent = f.name + ' (' + (f.size / 1024 / 1024).toFixed(1) + ' MB)';
        fileList.appendChild(li);
      });
      var big = tooBig();
      setStatus(big.length ? 'error' : '', big.length ? T.tooBig.replace('{n}', CONFIG.maxFileMB) + big.map(function (f) { return f.name; }).join(', ') : '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.elements.website && form.elements.website.value) return; // apsauga nuo robotų
      var big = tooBig();
      if (big.length) {
        setStatus('error', T.tooBig.replace('{n}', CONFIG.maxFileMB) + big.map(function (f) { return f.name; }).join(', '));
        return;
      }
      if (!CONFIG.formEndpoint) { setStatus('warn', T.notConnected); return; }

      submit.disabled = true;
      submit.textContent = T.sending;
      setStatus('', '');
      var send = function (data) {
        return fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); });
      };
      var hasFiles = fileInput.files.length > 0;
      var okText = T.ok;
      send(new FormData(form))
        .catch(function (err) {
          // Jei formų paslauga nepriima failų, užklausą siunčiame be jų
          if (!hasFiles) throw err;
          var data = new FormData(form);
          data.delete('attachment');
          okText = T.okNoFile;
          return send(data);
        })
        .then(function () {
          form.reset();
          fileList.innerHTML = '';
          setStatus('ok', okText);
        })
        .catch(function () { setStatus('error', T.error); })
        .then(function () {
          submit.disabled = false;
          submit.textContent = submitLabel;
        });
    });
  }
})();
