/* ============================================================
   SofiaPulse — Main JavaScript
   Complete production-ready script
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. WELCOME ANIMATION SEQUENCE
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    var welcomeOverlay = document.getElementById('welcome-overlay');
    var welcomeLogo = document.querySelector('.welcome-logo');
    var welcomePaths = document.querySelectorAll('.welcome-line-path');
    var animationSkipped = false;

    body.style.overflow = 'hidden';

    var timers = [];

    timers.push(setTimeout(function () {
      if (animationSkipped) return;
      if (welcomeLogo) welcomeLogo.classList.add('animate');
      welcomePaths.forEach(function(path) {
        path.classList.add('animate');
      });
    }, 200));

    timers.push(setTimeout(function () {
      if (animationSkipped) return;
      if (welcomeOverlay) welcomeOverlay.classList.add('fade-out');
    }, 2500));

    timers.push(setTimeout(function () {
      if (animationSkipped) return;
      dismissWelcome();
    }, 3500));

    /* Dismiss helper */
    function dismissWelcome() {
      if (welcomeOverlay) {
        welcomeOverlay.style.display = 'none';
      }
      body.style.overflow = '';
    }

    /* Click / tap to skip */
    if (welcomeOverlay) {
      welcomeOverlay.addEventListener('click', function () {
        if (animationSkipped) return;
        animationSkipped = true;

        /* Clear pending timers */
        timers.forEach(function (id) {
          clearTimeout(id);
        });

        welcomeOverlay.classList.add('fade-out');
        setTimeout(function () {
          dismissWelcome();
        }, 600);
      });
    }

    /* ----------------------------------------------------------
       2. NAVBAR SCROLL BEHAVIOR
    ---------------------------------------------------------- */
    var navbar = document.getElementById('navbar');
    var lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
      var currentScrollY = window.scrollY;

      if (navbar) {
        /* Hide / show on scroll direction */
        if (currentScrollY > lastScrollY + 10 && currentScrollY > 200) {
          navbar.classList.add('hidden');
        } else if (currentScrollY < lastScrollY - 10) {
          navbar.classList.remove('hidden');
        }

        /* Scrolled state */
        if (currentScrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      lastScrollY = currentScrollY;
    }, { passive: true });

    /* ----------------------------------------------------------
       3. MOBILE MENU
    ---------------------------------------------------------- */
    var mobileToggle = document.getElementById('mobile-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function () {
        var isActive = mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        if (isActive) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      });

      /* Close on link click */
      var mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          mobileToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          body.style.overflow = '';
        });
      });
    }

    /* ----------------------------------------------------------
       4. VIDEO SCROLL CANVAS
    ---------------------------------------------------------- */
    var canvas = document.getElementById('video-canvas');
    var video = document.getElementById('scroll-video');
    var videoSection = document.getElementById('video-section');

    if (canvas && video && videoSection) {
      var ctx = canvas.getContext('2d', { alpha: false }); // alpha: false helps performance
      // Dimensions will be set on loadedmetadata to match video native resolution

      var seeking = false;

      /* Resize canvas to cover viewport at native aspect ratio */
      function resizeCanvas() {
        if (!video.videoWidth) return; // Wait until video metadata is loaded

        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var videoAspect = video.videoWidth / video.videoHeight;
        var viewportAspect = viewportWidth / viewportHeight;

        var displayWidth, displayHeight;

        if (viewportAspect > videoAspect) {
          /* Viewport is wider — fit width, overflow height */
          displayWidth = viewportWidth;
          displayHeight = viewportWidth / videoAspect;
        } else {
          /* Viewport is taller — fit height, overflow width */
          displayHeight = viewportHeight;
          displayWidth = viewportHeight * videoAspect;
        }

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        canvas.style.position = 'absolute';
        canvas.style.left = (viewportWidth - displayWidth) / 2 + 'px';
        canvas.style.top = (viewportHeight - displayHeight) / 2 + 'px';

        /* Maximize resolution for retina screens */
        var dpr = window.devicePixelRatio || 1;
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        /* Re-apply high quality smoothing after resize */
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (!seeking && video.readyState >= 1) {
          drawFrame();
        }
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      /* Draw current video frame onto canvas */
      function drawFrame() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      /* On seeked, paint the frame and release the lock */
      video.addEventListener('seeked', function () {
        drawFrame();
        seeking = false;
      });

      /* Overlay references */
      var overlay1 = document.getElementById('overlay-1');
      var overlay2 = document.getElementById('overlay-2');
      var overlay3 = document.getElementById('overlay-3');
      var overlay4 = document.getElementById('overlay-4');
      var gradientBottom = document.querySelector('.video-gradient-bottom');

      /* Wrap text in overlays for premium word reveal animation */
      var overlaysToWrap = [overlay1, overlay2, overlay3, overlay4];
      overlaysToWrap.forEach(function(overlay) {
        if (!overlay) return;
        var textElements = overlay.querySelectorAll('h1, h2, p');
        textElements.forEach(function(el) {
          var words = el.innerText.split(' ');
          el.innerHTML = '';
          words.forEach(function(word, i) {
            var span = document.createElement('span');
            span.textContent = word + ' ';
            span.className = 'reveal-word';
            span.style.setProperty('--word-index', i);
            el.appendChild(span);
          });
        });
      });

      /* Update overlays based on scroll progress */
      function updateOverlays(scrollProgress) {
        if (overlay1) {
          overlay1.classList.toggle('active', scrollProgress >= 0.03 && scrollProgress <= 0.22);
        }
        if (overlay2) {
          overlay2.classList.toggle('active', scrollProgress >= 0.25 && scrollProgress <= 0.47);
        }
        if (overlay3) {
          overlay3.classList.toggle('active', scrollProgress >= 0.50 && scrollProgress <= 0.72);
        }
        if (overlay4) {
          overlay4.classList.toggle('active', scrollProgress >= 0.75 && scrollProgress <= 0.97);
        }
        if (gradientBottom) {
          gradientBottom.classList.toggle('active', scrollProgress >= 0.75);
        }

      }

      /* Scroll-driven video seek */
      function handleVideoScroll() {
        var sectionTop = videoSection.offsetTop;
        var scrollProgress = (window.scrollY - sectionTop) / (videoSection.offsetHeight - window.innerHeight);

        /* Clamp 0–1 */
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        /* Seek video */
        if (video.duration && !isNaN(video.duration)) {
          var targetTime = scrollProgress * video.duration;

          if (!seeking && Math.abs(video.currentTime - targetTime) > 0.01) {
            seeking = true;
            video.currentTime = targetTime;
          }
        }

        /* Update overlays */
        updateOverlays(scrollProgress);
      }

      window.addEventListener('scroll', handleVideoScroll, { passive: true });

      /* Once metadata is loaded, configure canvas and draw the first frame */
      video.addEventListener('loadedmetadata', function () {
        resizeCanvas();
        video.currentTime = 0;
        /* Handle case where user has already scrolled */
        handleVideoScroll();
      });

      /* Also try to draw first frame if video is already ready */
      if (video.readyState >= 1) {
        resizeCanvas();
        video.currentTime = 0;
        handleVideoScroll();
      }
    }

    /* ----------------------------------------------------------
       6. SCROLL REVEAL ANIMATIONS
    ---------------------------------------------------------- */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;

          /* Stagger siblings in grids */
          if (
            el.classList.contains('feature-card') ||
            el.classList.contains('stat-item') ||
            el.classList.contains('testimonial-card')
          ) {
            var parent = el.parentElement;
            if (parent) {
              var siblings = Array.from(parent.children);
              var index = siblings.indexOf(el);
              /* Determine columns per row from grid or fallback */
              var columnsPerRow = getColumnsPerRow(parent);
              var delayIndex = index % columnsPerRow;
              el.style.transitionDelay = delayIndex * 100 + 'ms';
            }
          }

          el.classList.add('revealed');

          /* Trigger stat counter if it's a stat item */
          if (el.classList.contains('stat-item')) {
            animateStatValue(el);
          }

          revealObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    /* Determine column count from computed grid styles */
    function getColumnsPerRow(parent) {
      var computedStyle = getComputedStyle(parent);
      var gridColumns = computedStyle.getPropertyValue('grid-template-columns');
      if (gridColumns && gridColumns !== 'none') {
        return gridColumns.split(' ').length;
      }
      /* Fallback: guess from first row */
      return 3;
    }

    /* Observe all revealable elements */
    var revealTargets = document.querySelectorAll(
      '.feature-card, .stat-item, .testimonial-card, .reveal-up'
    );
    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });

    /* ----------------------------------------------------------
       7. STAT COUNTER ANIMATION
    ---------------------------------------------------------- */
    function animateStatValue(statItem) {
      var statValueEl = statItem.querySelector('.stat-value');
      if (!statValueEl) return;

      var target = parseFloat(statValueEl.getAttribute('data-target'));
      if (isNaN(target)) return;

      var isDecimal = String(target).indexOf('.') !== -1;
      var duration = 2000;
      var startTime = null;

      function easeOutExpo(t) {
        return 1 - Math.pow(2, -10 * t);
      }

      function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var t = Math.min(elapsed / duration, 1);
        var easedT = easeOutExpo(t);
        var currentValue = easedT * target;

        if (isDecimal) {
          statValueEl.textContent = currentValue.toFixed(1);
        } else {
          statValueEl.textContent = Math.round(currentValue);
        }

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          /* Ensure final value is exact */
          if (isDecimal) {
            statValueEl.textContent = target.toFixed(1);
          } else {
            statValueEl.textContent = Math.round(target);
          }
        }
      }

      requestAnimationFrame(tick);
    }

    /* ----------------------------------------------------------
       8. CONTACT FORM
    ---------------------------------------------------------- */
    var contactForm = document.getElementById('contact-form');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var submitBtn = contactForm.querySelector('button[type="submit"]');
        if (!submitBtn) {
          submitBtn = contactForm.querySelector('button');
        }
        if (!submitBtn) return;

        var originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Sent!';

        setTimeout(function () {
          submitBtn.textContent = 'Book a Demo';
        }, 3000);
      });
    }

    /* ----------------------------------------------------------
       9. SMOOTH SCROLL FOR ANCHOR LINKS
    ---------------------------------------------------------- */
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var targetEl = document.querySelector(href);
        if (!targetEl) return;

        e.preventDefault();

        /* Close mobile menu if open */
        if (mobileToggle && mobileMenu) {
          if (mobileToggle.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
          }
        }

        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });

    /* ----------------------------------------------------------
       10. PROCESS VIDEO SCROLL LOGIC
    ---------------------------------------------------------- */
    var processVideo = document.getElementById('process-video');
    var processSteps = document.querySelectorAll('.process-step');
    
    if (processVideo && processSteps.length > 0) {
      /* Define 4 generic segments for the 53.2s video */
      var segments = [
        { start: 0, end: 13 },
        { start: 13, end: 26 },
        { start: 26, end: 39 },
        { start: 39, end: 53.1 }
      ];
      
      var activeSegmentIndex = 0;
      
      function ensurePlaying() {
        if (processVideo.paused) {
          var playPromise = processVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(function(error) {
              console.log("Autoplay prevented:", error);
            });
          }
        }
      }
      
      var stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            processSteps.forEach(function(step) {
              step.classList.remove('active');
            });
            
            entry.target.classList.add('active');
            
            var stepNum = parseInt(entry.target.getAttribute('data-step')) || 1;
            activeSegmentIndex = stepNum - 1;
            
            var seg = segments[activeSegmentIndex];
            if (processVideo.currentTime < seg.start || processVideo.currentTime > seg.end) {
              processVideo.currentTime = seg.start;
            }
            ensurePlaying();
          }
        });
      }, {
        threshold: 0.5,
        rootMargin: "-10% 0px -10% 0px"
      });
      
      processSteps.forEach(function(step) {
        stepObserver.observe(step);
      });
      
      processVideo.addEventListener('timeupdate', function() {
        var seg = segments[activeSegmentIndex];
        if (processVideo.currentTime >= seg.end) {
          processVideo.currentTime = seg.start;
          ensurePlaying();
        }
      });
    }

    /* ----------------------------------------------------------
       11. SMOOTH SCROLLING (LENIS)
    ---------------------------------------------------------- */
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        smoothWheel: true,
        wheelMultiplier: 1.2
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

  }); /* end DOMContentLoaded */
})();
