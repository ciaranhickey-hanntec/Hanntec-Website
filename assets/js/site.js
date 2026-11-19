/* Hanntec Engineering website: small, dependency-free script. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     SETTINGS YOU MAY WANT TO CHANGE
     ------------------------------------------------------------------ */
  var CONFIG = {
    // Contact form: enquiries are posted to Netlify Forms (the site's host), which
    // filters spam and emails each one to the addresses set in Netlify under
    // Forms > Submission notifications. '/' is right for Netlify; only change it
    // if the site moves to another host and form service.
    formEndpoint: '/',
    enquiryEmail: 'jack@hanntec.com',   // shown to visitors if sending fails

    // Team LinkedIn profiles. Paste each person's profile address between the
    // quotes. Until then the button opens a LinkedIn search for their name.
    linkedin: {
      'jack-walshe': '',
      'jackie-barden': '',
      'niamh-kelly': '',
      'ciaran-hickey': '',
      'niamh-walshe': ''
    }
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Draft notes toggle ---------- */
  (function () {
    var btn = $('.draft-toggle');
    if (!btn) return;
    var root = document.documentElement;
    var KEY = 'hanntec-draft-notes';
    var off = /[?&]final\b/.test(location.search);
    try { if (!off && localStorage.getItem(KEY) === 'off') off = true; } catch (e) { /* storage blocked */ }

    function sync() {
      root.classList.toggle('drafts-off', off);
      btn.setAttribute('aria-pressed', String(!off));
      btn.textContent = 'Draft notes: ' + (off ? 'off' : 'on');
      $$('[data-hide-if-empty]').forEach(function (s) { s.classList.toggle('is-empty', !s.querySelector('img')); });
    }
    btn.addEventListener('click', function () {
      off = !off;
      try { localStorage.setItem(KEY, off ? 'off' : 'on'); } catch (e) { /* ignore */ }
      sync();
    });
    sync();
    window.addEventListener('load', sync);
  })();

  /* ---------- Navigation ---------- */
  (function () {
    var toggle = $('.nav-toggle');
    var nav = $('#site-nav');
    var menuBtn = $('.nav__link--menu');
    var hasMenu = $('.has-menu');
    if (!nav) return;

    function closeMenu() {
      if (hasMenu) hasMenu.classList.remove('open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    }
    function closeNav() {
      nav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var open = hasMenu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });
    }
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { closeMenu(); closeNav(); }); });
    document.addEventListener('click', function (e) {
      if (hasMenu && !hasMenu.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var wasOpen = hasMenu && hasMenu.classList.contains('open');
      closeMenu();
      closeNav();
      if (wasOpen && menuBtn) menuBtn.focus();
    });
  })();

  /* ---------- Header: transparent over the dark hero, solid once scrolled ---------- */
  (function () {
    var header = $('[data-header]');
    var nav = $('#site-nav');
    if (!header) return;
    function sync() {
      var solid = window.scrollY > 24 || (nav && nav.classList.contains('open'));
      header.classList.toggle('is-solid', solid);
    }
    window.addEventListener('scroll', sync, { passive: true });
    if (nav && window.MutationObserver) new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ['class'] });
    sync();
  })();

  /* ---------- Hero video ----------
     The poster image always shows first. The video is only fetched on screens wider than 700px,
     never for visitors who ask for reduced motion or less data, and it pauses while scrolled out of view. */
  (function () {
    var video = $('.hero__video');
    var toggle = $('.hero__toggle');
    if (!video) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    var small = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
    if (reduceMotion || saveData || small) return;

    [['webm', video.getAttribute('data-webm')], ['mp4', video.getAttribute('data-mp4')]].forEach(function (f) {
      var s = document.createElement('source');
      s.src = f[1]; s.type = 'video/' + f[0];
      video.appendChild(s);
    });
    video.load();

    var userPaused = false;
    function play() {
      var p = video.play();
      if (p && p.then) p.then(function () { video.classList.add('is-playing'); if (toggle) toggle.hidden = false; }, function () {});
    }
    play();

    if (toggle) {
      toggle.addEventListener('click', function () {
        userPaused = !video.paused;
        if (userPaused) video.pause(); else play();
        toggle.setAttribute('aria-pressed', String(userPaused));
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) video.pause();
        else if (!userPaused) play();
      }).observe(video);
    }
  })();

  /* ---------- Before / after slider ---------- */
  (function () {
    var el = $('[data-reveal]');
    if (!el) return;
    var input = $('input[type="range"]', el);
    var FEATHER = 6;                       // must match --feather in the stylesheet (percent)
    var cur = reduceMotion ? 50 : 100;     // starts showing the "before" photo, then sweeps to the middle
    var target = cur, raf = 0, touched = false;

    function apply(p) {
      el.style.setProperty('--pos', p.toFixed(2) + '%');
      // the soft edge travels slightly beyond 0 and 100 so each photo can be shown completely
      el.style.setProperty('--c', (-FEATHER + p * (100 + 2 * FEATHER) / 100).toFixed(2) + '%');
    }
    function loop() {
      var d = target - cur;
      if (Math.abs(d) < 0.05) { cur = target; apply(cur); raf = 0; input.value = Math.round(target); return; }
      cur += d * 0.14;                     // eased follow: the divider glides to where you point
      apply(cur);
      raf = requestAnimationFrame(loop);
    }
    function go(t) {
      target = Math.max(0, Math.min(100, t));
      if (reduceMotion) { cur = target; apply(cur); input.value = Math.round(target); return; }
      if (!raf) raf = requestAnimationFrame(loop);
    }

    input.addEventListener('input', function () { touched = true; go(Number(input.value)); });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      touched = true;
      go(target + (e.key === 'ArrowRight' ? 8 : -8));
    });

    apply(cur);
    input.value = Math.round(cur);
    // one gentle sweep the first time the slider scrolls into view
    if (!reduceMotion && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setTimeout(function () { if (!touched) go(50); }, 400);
      }, { threshold: 0.55 });
      io.observe(el);
    } else {
      go(50);
    }
  })();

  /* ---------- Team profiles ---------- */
  (function () {
    var buttons = $$('[data-profile]');
    if (!buttons.length) return;

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var d = document.getElementById(b.getAttribute('data-profile'));
        if (d && d.showModal) d.showModal();
      });
    });
    $$('dialog.profile').forEach(function (d) {
      d.addEventListener('click', function (e) {
        var r = d.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) d.close();
      });
    });
    $$('[data-linkedin]').forEach(function (a) {
      var slug = a.getAttribute('data-linkedin');
      var url = CONFIG.linkedin[slug];
      if (!url) {
        var name = slug.replace(/-/g, ' ');
        url = 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(name + ' Hanntec');
      }
      a.setAttribute('href', url);
    });
  })();

  /* ---------- Client wheel ---------- */
  (function () {
    var wheel = $('[data-wheel]');
    if (!wheel) return;
    var ring = $('.wheel__ring', wheel);
    var items = $$('.wheel__item', ring);
    var n = items.length;
    var step = 360 / n;
    var theta = 0, auto = !reduceMotion, hover = false, dragging = false, visible = true;
    var anim = null, raf = 0, last = 0, lastX = 0, vel = 0;
    var SPEED = -4.2; // degrees per second while turning on its own (one logo about every 7 seconds)
    var toggle = $('[data-wheel-toggle]');

    function render() {
      ring.style.transform = 'translateZ(calc(var(--R) * -1)) rotateY(' + theta.toFixed(2) + 'deg)';
      for (var i = 0; i < n; i++) {
        var a = (i * step + theta) * Math.PI / 180;
        var f = Math.cos(a);
        items[i].style.opacity = f > 0 ? (0.3 + 0.7 * Math.pow(f, 1.6)).toFixed(3) : 0;
      }
    }

    function snap(v) { return Math.round(v / step) * step; }

    function animateTo(target, ms) {
      var from = theta, t0 = null;
      anim = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / ms, 1);
        var e = 1 - Math.pow(1 - p, 3);
        theta = from + (target - from) * e;
        if (p >= 1) anim = null;
      };
    }

    function tick(ts) {
      var dt = Math.min(ts - last, 60) / 1000;
      last = ts;
      if (anim) anim(ts);
      else if (!dragging && auto && !hover && !document.hidden) theta += SPEED * dt;
      render();
      raf = visible ? requestAnimationFrame(tick) : 0;
    }

    function setAuto(on) {
      auto = on;
      if (toggle) toggle.textContent = on ? 'Pause' : 'Play';
    }
    setAuto(auto);

    wheel.addEventListener('pointerdown', function (e) {
      dragging = true; anim = null; vel = 0; lastX = e.clientX;
      try { wheel.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      theta += dx * 0.2;
      vel = dx * 0.2;
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      animateTo(snap(theta + vel * 16), 700);
    }
    wheel.addEventListener('pointerup', release);
    wheel.addEventListener('pointercancel', release);
    wheel.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
    wheel.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hover = false; });
    wheel.addEventListener('focusin', function () { hover = true; });
    wheel.addEventListener('focusout', function () { hover = false; });

    function turn(dir) { animateTo(snap(theta) + dir * step, 650); }
    wheel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
    });
    var prev = $('[data-wheel-prev]'), next = $('[data-wheel-next]');
    if (prev) prev.addEventListener('click', function () { turn(1); });
    if (next) next.addEventListener('click', function () { turn(-1); });
    if (toggle) toggle.addEventListener('click', function () { setAuto(!auto); });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
      }).observe(wheel);
    }
    render();
    raf = requestAnimationFrame(tick);
  })();

  /* ---------- Projects: filter by sector ---------- */
  (function () {
    var btns = $$('[data-filter]');
    if (!btns.length) return;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('[data-cases] .case').forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-sector') !== f; });
      });
    });
  })();

  /* ---------- Contact form ---------- */
  (function () {
    var form = $('[data-enquiry]');
    if (!form) return;
    var status = $('.form__status', form);

    // Pre-select from links such as contact.html?service=design&sector=healthcare
    var params = new URLSearchParams(location.search);
    [['service', 'f-need'], ['sector', 'f-sector']].forEach(function (pair) {
      var v = params.get(pair[0]);
      var sel = document.getElementById(pair[1]);
      if (v && sel && $('option[value="' + v.replace(/"/g, '') + '"]', sel)) sel.value = v;
    });

    var messages = {
      name: 'Enter your name.',
      email: 'Enter a valid email address, for example name@company.ie.',
      message: 'Tell us a little about your project.',
      consent: 'Tick this box so we can reply to you.'
    };

    function setError(field, text) {
      var wrap = field.closest('.field');
      var err = wrap && $('.field__error', wrap);
      if (!err) return;
      if (text) {
        err.textContent = text;
        err.hidden = false;
        if (!err.id) err.id = field.id + '-error';
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', err.id);
      } else {
        err.hidden = true;
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
    }

    function validate() {
      var firstBad = null;
      ['name', 'email', 'message', 'consent'].forEach(function (n) {
        var f = form.elements[n] || document.getElementById('f-' + n); // the consent box has no name, so it is never sent
        var ok = f.type === 'checkbox' ? f.checked : (f.value.trim() !== '' && f.checkValidity());
        setError(f, ok ? '' : messages[n]);
        if (!ok && !firstBad) firstBad = f;
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid')) setError(e.target, '');
    });

    function say(text, kind) {
      status.textContent = text;
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
    }

    // With JavaScript on, the form checks itself and sends without leaving the page.
    // Without it, the browser checks the required fields and posts to Netlify, which shows thanks.html.
    form.noValidate = true;
    var done = $('[data-enquiry-done]');
    var btn = form.querySelector('button[type="submit"]');
    var sending = false;

    function label(n) {
      var f = form.elements[n];
      return f.tagName === 'SELECT' ? f.options[f.selectedIndex].text : f.value.trim();
    }

    function showDone(fields) {
      var first = fields.name.split(/\s+/)[0];
      $('[data-enquiry-name]', done).textContent = first ? ', ' + first : '';
      var dl = $('[data-enquiry-summary]', done);
      dl.textContent = '';
      fields.rows.forEach(function (row) {
        if (!row[1]) return;
        var div = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = row[0];
        var dd = document.createElement('dd'); dd.textContent = row[1];
        div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
      });
      form.hidden = true;
      done.hidden = false;
      done.focus();
      var top = done.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      if (!validate()) { say('Please fix the highlighted fields.', 'error'); return; }

      var name = form.elements.name.value.trim();
      var company = form.elements.company.value.trim();
      var need = form.elements.need.value ? label('need') : 'Not sure yet';
      var sector = form.elements.sector.value ? label('sector') : 'Other or not listed';

      // The notification email's subject line, e.g. "Website enquiry: Design & engineering, Mary Byrne (Acme Foods)"
      form.elements.subject.value = 'Website enquiry: ' + need + ', ' + name + (company ? ' (' + company + ')' : '');

      var body = new URLSearchParams(new FormData(form));
      body.set('need', need);       // send the readable names rather than the short codes
      body.set('sector', sector);
      ['company', 'phone', 'website'].forEach(function (n) { if (!body.get(n)) body.delete(n); }); // keep blank optional fields out of the email

      sending = true;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      say('Sending your enquiry…', '');

      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 15000);

      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
        body: body.toString(),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        say('', '');
        showDone({
          name: name,
          rows: [['Name', name], ['Company', company], ['Email', form.elements.email.value.trim()],
            ['Phone', form.elements.phone.value.trim()], ['Needs', need], ['Sector', sector],
            ['Message', form.elements.message.value.trim()]]
        });
        form.reset();
      }).catch(function () {
        // keep what they typed, and give them another way to reach us
        status.className = 'form__status is-error';
        status.textContent = '';
        status.appendChild(document.createTextNode('Sorry, your enquiry didn’t send. Please try again, or call '));
        var tel = document.createElement('a'); tel.href = 'tel:+353879122237'; tel.textContent = '087 912 2237';
        var mail = document.createElement('a'); mail.href = 'mailto:' + CONFIG.enquiryEmail; mail.textContent = CONFIG.enquiryEmail;
        status.appendChild(tel); status.appendChild(document.createTextNode(' or email ')); status.appendChild(mail);
        status.appendChild(document.createTextNode('.'));
      }).then(function () {
        if (timer) clearTimeout(timer);
        sending = false;
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      });
    });
  })();
})();
