// js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
  //
  // A) HOMEPAGE “Contact” FORM VIA EMAILJS
  //
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault(); // prevent normal form submission

      // 1) Grab values from the form
      const fromName  = document.getElementById('from_name').value.trim()  || '';
      const fromEmail = document.getElementById('from_email').value.trim() || '';
      const phone     = document.getElementById('phone').value.trim()      || '';
      const message   = document.getElementById('message').value.trim()    || '';

      // 2) Build the object matching your EmailJS template placeholders
      const templateParams = {
        from_name:  fromName,
        from_email: fromEmail,
        phone:      phone,
        message:    message
      };

      // 3) Insert your Service ID and Homepage Template ID here
      const YOUR_SERVICE_ID  = 'service_jdvioa3';
      const YOUR_TEMPLATE_ID = 'template_74v582p';

      // 4) Send via EmailJS
      emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams)
        .then(() => {
          // On success, clear the form and show an alert
          contactForm.reset();
          alert(`Thanks, ${fromName}! Your message has been sent. We’ll be in touch soon.`);
        })
        .catch(error => {
          console.error('EmailJS send failed:', error);
          alert('Oops—there was a problem sending your message. Please try again later.');
        });
    });
  }

  //
  // B) HEADER SHRINK ON SCROLL (unchanged)
  //
  const header = document.querySelector('header');
  const shrinkOn = 100;
  window.addEventListener('scroll', () => {
    header.classList.toggle('shrink', window.scrollY > shrinkOn);
  });

  //
  // C) MOBILE NAV TOGGLE (unchanged)
  //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu    = document.querySelector('nav ul');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  //
  // D) SCROLL-TRIGGERED .animate ELEMENTS (unchanged)
  //
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
  });

  //
  // E) ENROLLMENT MODAL + EMAILJS (unchanged from pricing)
  //
  const modalOverlay = document.getElementById('enroll-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const openButtons = document.querySelectorAll('.open-modal');
  const courseInput = document.getElementById('course-selected');
  const enrollForm  = document.getElementById('enroll-form');

  if (modalOverlay && modalCloseBtn && openButtons.length && courseInput && enrollForm) {
    // 1) OPEN MODAL
    openButtons.forEach(button => {
      button.addEventListener('click', () => {
        const courseName = button.getAttribute('data-course') || 'Unknown Course';
        courseInput.value = courseName;
        modalOverlay.style.display = 'flex';
        setTimeout(() => {
          document.querySelector('.modal').classList.add('visible');
        }, 50);
      });
    });

    // 2) CLOSE MODAL (× button)
    modalCloseBtn.addEventListener('click', () => {
      document.querySelector('.modal').classList.remove('visible');
      setTimeout(() => {
        modalOverlay.style.display = 'none';
      }, 300);
    });

    // 3) CLOSE MODAL WHEN CLICKING OUTSIDE
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) {
        document.querySelector('.modal').classList.remove('visible');
        setTimeout(() => {
          modalOverlay.style.display = 'none';
        }, 300);
      }
    });

    // 4) HANDLE ENROLLMENT FORM SUBMISSION VIA EMAILJS
    enrollForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = document.getElementById('student-name').value.trim()    || '';
      const email   = document.getElementById('student-email').value.trim()   || '';
      const phone   = document.getElementById('student-phone').value.trim()   || '';
      const message = document.getElementById('student-message').value.trim() || '';
      const course  = courseInput.value;

      const templateParams = {
        course:     course,
        from_name:  name,
        from_email: email,
        phone:      phone,
        message:    message
      };

      const YOUR_SERVICE_ID  = 'service_jdvioa3';
      const YOUR_TEMPLATE_ID = 'template_d316b3i';

      emailjs.send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams)
        .then(() => {
          document.querySelector('.modal').classList.remove('visible');
          setTimeout(() => {
            modalOverlay.style.display = 'none';
            alert(`Thanks, ${name}! Your enrollment inquiry has been sent.`);
          }, 300);
        })
        .catch(error => {
          console.error('EmailJS send failed:', error);
          alert('Oops—there was a problem sending your inquiry. Please try again later.');
        });
    });
  }
});
// ==============================
// A/B SWITCHER LOGIC (Checkbox)
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ab-card').forEach(card => {
    const pairId      = card.getAttribute('data-pair-id');
    const beforeAudio = document.getElementById(`before-audio-${pairId}`);
    const afterAudio  = document.getElementById(`after-audio-${pairId}`);
    const checkbox    = document.getElementById(`ab-switch-${pairId}`);

    // Skip if any element is missing
    if (!beforeAudio || !afterAudio || !checkbox) return;

    // 1) Keep play/pause in sync
    function syncAudio(event) {
      const src  = event.target;
      const dest = (src === beforeAudio ? afterAudio : beforeAudio);

      if (!src.paused) {
        // If dest is too far off, seek it
        if (Math.abs(dest.currentTime - src.currentTime) > 0.1) {
          dest.currentTime = src.currentTime;
        }
        if (dest.paused) dest.play().catch(() => {});
      } else {
        if (!dest.paused) dest.pause();
      }
    }

    // 2) Keep seeking (timeupdate) in sync
    function syncSeek(event) {
      const src  = event.target;
      const dest = (src === beforeAudio ? afterAudio : beforeAudio);

      if (Math.abs(dest.currentTime - src.currentTime) > 0.2) {
        dest.currentTime = src.currentTime;
      }
    }

    beforeAudio.addEventListener('play', syncAudio);
    afterAudio.addEventListener('play', syncAudio);
    beforeAudio.addEventListener('pause', syncAudio);
    afterAudio.addEventListener('pause', syncAudio);
    beforeAudio.addEventListener('timeupdate', syncSeek);
    afterAudio.addEventListener('timeupdate', syncSeek);

    // 3) Initialize state: show “Before”, hide “After”
    beforeAudio.muted = false;
    afterAudio.muted  = true;
    checkbox.checked  = false;

    // 4) Toggle handler: checkbox change
    checkbox.addEventListener('change', () => {
      const showingBefore = !beforeAudio.muted;
      if (showingBefore) {
        // Switch to After
        beforeAudio.muted = true;
        afterAudio.muted  = false;
      } else {
        // Switch back to Before
        beforeAudio.muted = false;
        afterAudio.muted  = true;
      }
      // Keep both audios at same time position
      afterAudio.currentTime = beforeAudio.currentTime;
    });
  });
});

