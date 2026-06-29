(function () {
  'use strict';

  // 1. Проверка настроек анимации пользователя
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Логика прелоадера
  function hidePreloader() {
    document.body.classList.add('is-loaded');
  }

  window.addEventListener('load', function () {
    setTimeout(hidePreloader, prefersReducedMotion ? 0 : 900);
  });

  setTimeout(hidePreloader, 4000);

  // 3. Управление фоновой музыкой
  // 3. Управление фоновой музыкой (с автозапуском при любом действии: клик, тап, скролл)
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');

  if (musicBtn && bgMusic) {
    
    // Функция включения музыки при первом действии пользователя
    function playAudio() {
      if (bgMusic.paused) {
        bgMusic.play().then(function () {
          musicBtn.classList.add('is-playing');
          musicBtn.setAttribute('aria-label', 'Выключить музыку');
          
          // Как только музыка заиграла, полностью удаляем все глобальные слушатели
          removeGlobalListeners();
        }).catch(function (error) {
          console.warn('Браузер всё ещё блокирует автозвук. Ждем прямого клика по кнопке.', error);
        });
      }
    }

    // Функция удаления слушателей, чтобы код не срабатывал при каждом скролле постоянно
    function removeGlobalListeners() {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('touchstart', playAudio);
      window.removeEventListener('scroll', playAudio);
      document.removeEventListener('touchmove', playAudio);
    }

    // Слушаем ВСЕ возможные действия гостя для моментального старта
    document.addEventListener('click', playAudio);      // Клик мышкой
    document.addEventListener('touchstart', playAudio); // Тап по экрану на телефоне
    window.addEventListener('scroll', playAudio);       // Прокрутка колесиком или на ПК
    document.addEventListener('touchmove', playAudio);  // Прокрутка пальцем на телефоне

    // Логика самой кнопки (включить/выключить вручную)
    musicBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Отменяем всплытие, чтобы не дублировать клик по документу
      if (!bgMusic.paused) {
        bgMusic.pause();
        musicBtn.classList.remove('is-playing');
        musicBtn.setAttribute('aria-label', 'Включить музыку');
      } else {
        bgMusic.play();
        musicBtn.classList.add('is-playing');
        musicBtn.setAttribute('aria-label', 'Выключить музыку');
      }
    });

    bgMusic.addEventListener('pause', function () {
      musicBtn.classList.remove('is-playing');
      musicBtn.setAttribute('aria-label', 'Включить музыку');
    });
  }
  // const musicBtn = document.getElementById('musicBtn');
  // const bgMusic = document.getElementById('bgMusic');

  // if (musicBtn && bgMusic) {
  //   musicBtn.addEventListener('click', function () {
  //     if (bgMusic.paused) {
  //       bgMusic.play().then(function () {
  //         musicBtn.classList.add('is-playing');
  //         musicBtn.setAttribute('aria-label', 'Выключить музыку');
  //       }).catch(function () {
  //         console.warn('Не удалось воспроизвести аудио. Добавьте файл track.mp3.');
  //       });
  //     } else {
  //       bgMusic.pause();
  //       musicBtn.classList.remove('is-playing');
  //       musicBtn.setAttribute('aria-label', 'Включить музыку');
  //     }
  //   });

  //   bgMusic.addEventListener('pause', function () {
  //     musicBtn.classList.remove('is-playing');
  //     musicBtn.setAttribute('aria-label', 'Включить музыку');
  //   });
  // }

  // 4. Скролл-анимации через IntersectionObserver
  const animElements = document.querySelectorAll('.anim');

  if (animElements.length && !prefersReducedMotion) {
    const animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    animElements.forEach(function (el) { animObserver.observe(el); });
  } else {
    animElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // 5. Поочередная анимация элементов в Hero секции
  const heroAnims = document.querySelectorAll('.hero .anim');
  if (!prefersReducedMotion) {
    heroAnims.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-visible'); }, 600 + i * 150);
    });
  } else {
    heroAnims.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // 6. Генерация блесток (Sparkles)
  const sparklesContainer = document.getElementById('sparkles');
  if (sparklesContainer && !prefersReducedMotion) {
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('span');
      dot.className = 'sparkle';
      dot.style.left = (Math.random() * 100) + '%';
      dot.style.top = (Math.random() * 100) + '%';
      dot.style.setProperty('--dur', (2.5 + Math.random() * 3) + 's');
      dot.style.setProperty('--delay', (-Math.random() * 5) + 's');
      dot.style.setProperty('--op', 0.3 + Math.random() * 0.5);
      sparklesContainer.appendChild(dot);
    }
  }

  // 7. Генерация лепестков (Petals) с адаптивностью
  const petalsContainer = document.getElementById('petals');
  if (petalsContainer && !prefersReducedMotion) {
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    const petalsCount = isMobile ? 18 : 10;

    for (let i = 0; i < petalsCount; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = (Math.random() * 100) + '%';
      petal.style.setProperty('--size', ((isMobile ? 7 : 6) + Math.random() * (isMobile ? 10 : 8)) + 'px');
      petal.style.setProperty('--duration', ((isMobile ? 8 : 10) + Math.random() * (isMobile ? 8 : 10)) + 's');
      petal.style.setProperty('--delay', (-Math.random() * (isMobile ? 10 : 14)) + 's');
      petal.style.setProperty('--drift', ((isMobile ? -45 : -25) + Math.random() * (isMobile ? 90 : 50)) + 'px');
      petal.style.setProperty('--rotate', (Math.random() * 360) + 'deg');
      petal.style.setProperty('--opacity', (isMobile ? 0.32 : 0.2) + Math.random() * (isMobile ? 0.24 : 0.25));
      petalsContainer.appendChild(petal);
    }
  }

  // 8. Анимация полета бабочки (Повторы удалены)
  const butterflyFlyer = document.getElementById('butterflyFlyer');
  if (butterflyFlyer && !prefersReducedMotion) {
    butterflyFlyer.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><g class="butterfly-wing-left"><path d="M31 30C21 10 5 8 6 25c1 13 13 17 25 9z" fill="#d98d95" stroke="#9c7652" stroke-width="1.7"/><path d="M29 34C17 35 10 43 17 52c8 9 17 1 16-14z" fill="#f0c0b0" stroke="#9c7652" stroke-width="1.5"/></g><g class="butterfly-wing-right"><path d="M33 30c10-20 26-22 25-5-1 13-13 17-25 9z" fill="#caa15c" stroke="#9c7652" stroke-width="1.7"/><path d="M35 34c12 1 19 9 12 18-8 9-17 1-16-14z" fill="#e8ad9e" stroke="#9c7652" stroke-width="1.5"/></g><path d="M31 26c-2 6-2 15 0 22 1 3 5 3 6 0 2-7 2-16 0-22-1-3-5-3-6 0z" fill="#6f5a4a"/><path d="M32 24c-4-7-8-10-12-12M36 24c4-7 8-10 12-12" fill="none" stroke="#6f5a4a" stroke-width="1.6" stroke-linecap="round"/></svg>';

    let lastX = window.innerWidth * 0.2;
    let lastY = window.innerHeight * 0.18;

    function moveButterfly() {
      const margin = 34;
      const maxX = Math.max(margin, window.innerWidth - margin - 50);
      const maxY = Math.max(margin, window.innerHeight - margin - 50);
      const nextX = margin + Math.random() * (maxX - margin);
      const nextY = margin + Math.random() * (maxY - margin);
      const angle = Math.max(-24, Math.min(24, (nextX - lastX) * 0.08));
      const duration = 4.8 + Math.random() * 2.8;

      butterflyFlyer.style.setProperty('--butterfly-duration', duration + 's');
      butterflyFlyer.style.transform = 'translate3d(' + nextX + 'px, ' + nextY + 'px, 0) rotate(' + angle + 'deg)';
      lastX = nextX;
      lastY = nextY;
      window.setTimeout(moveButterfly, duration * 1000);
    }

    moveButterfly();
  }

  // 9. Генерация дней недели на кыргызском языке
  const weekdaysCol = document.getElementById('weekdaysCol');
  const EVENT_WEEKDAY = 4; // Четверг (БЕЙШЕМБИ)
  const WEEKDAYS_KY = ['ЖЕКШЕМБИ', 'ДҮЙШӨМБҮ', 'ШЕЙШЕМБИ', 'ШАРШЕМБИ', 'БЕЙШЕМБИ', 'ЖУМА', 'ИШЕМБИ'];

  if (weekdaysCol) {
    WEEKDAYS_KY.forEach(function (name, index) {
      const el = document.createElement('span');
      el.className = 'calendar-pro__weekday';
      el.textContent = name;
      const dist = Math.abs(index - EVENT_WEEKDAY);
      if (dist === 0) el.classList.add('calendar-pro__weekday--event');
      else if (dist === 1) el.classList.add('calendar-pro__weekday--closer');
      else if (dist === 2) el.classList.add('calendar-pro__weekday--near');
      weekdaysCol.appendChild(el);
    });
  }

  // 10. Обратный отсчет (Таймер)
  const TARGET_DATE = new Date(2026, 6, 23, 16, 0, 0); // 23 июля 2026, 16:00 (6 — это Июль, т.к. отсчет месяцев с 0)
  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');
  const elGrid = document.getElementById('countdownGrid');
  const elPast = document.getElementById('countdownPast');
  const countdownEls = [elDays, elHours, elMinutes, elSeconds];
  const prevValues = countdownEls.map(function () { return null; });

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickElement(el, index, newValue) {
    if (!el) return;
    if (!prefersReducedMotion && prevValues[index] !== null && prevValues[index] !== newValue) {
      el.classList.remove('is-ticking');
      void el.offsetWidth; // Триггер reflow для перезапуска CSS-анимации
      el.classList.add('is-ticking');
    }
    el.textContent = newValue;
    prevValues[index] = newValue;
  }

  function updateCountdown() {
    const diff = TARGET_DATE - new Date();
    if (diff <= 0) {
      if (elGrid) elGrid.hidden = true;
      if (elPast) elPast.hidden = false;
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    tickElement(elDays, 0, pad(Math.floor(totalSeconds / 86400)));
    tickElement(elHours, 1, pad(Math.floor((totalSeconds % 86400) / 3600)));
    tickElement(elMinutes, 2, pad(Math.floor((totalSeconds % 3600) / 60)));
    tickElement(elSeconds, 3, pad(totalSeconds % 60));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();