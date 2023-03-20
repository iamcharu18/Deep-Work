/***************************************************
==================== JS INDEX ======================
****************************************************
01. Preloader
02. Go top Top
03. Offcanvas Menu Control
04. Header Search
05. Header | Home One
06. Header | Home Two
07. Counter Activation
08. Testimonial Slider | Home 1
09. Testimonial Slider | Home 2
10. Team Slider
11. MixitUp activation
12. WOW JS Activation
13. Mobile Menu Activation
14. ProgressBar activation



****************************************************/

(function ($) {
  "use strict";

  /////////////////////////////////////////////////////
  // 01. Preloader
  var preloader = document.querySelector("#preloader");
  var get_body = document.querySelector("body");

  get_body.onload = function () {
    preloader.style.display = "none";
  };
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 02. Go top Top
  let scroll_top = document.getElementById("scroll_top");

  if (scroll_top) {
    scroll_top.addEventListener('click', function () {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  }
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 03. Offcanvas Menu Control
  $('.menu-icon').on('click', function () {
    $('.offcanvas__area').addClass('showed');
  });

  $('#offcanvas_close').on('click', function () {
    $('.offcanvas__area').removeClass('showed');
  });
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 04. Header Search
  $('.search-icon').on('click', function () {
    $(this).hide();
    $('.search-close').show();
    $('.header__search').addClass('showed');
  });

  $('.search-close').on('click', function () {
    $(this).hide();
    $('.search-icon').show();
    $('.header__search').removeClass('showed');
  });
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 05. Header Sticky
  let header_menu = document.querySelector('#header__sticky');
  var prevScrollpos = window.pageYOffset;

  if (header_menu) {
    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        header_menu.classList.add('sticky');
        scroll_top.classList.remove('showed');
      } else {
        header_menu.classList.remove('sticky');
        scroll_top.classList.add('showed');
      }
      prevScrollpos = currentScrollPos;

      if (currentScrollPos < 5) {
        header_menu.classList.remove('sticky');
      }
    }
  }
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 06. 

  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 07. Counter Activation
  const counter_1 = window.counterUp.default
  const counter_cb = entries => {

    entries.forEach(entry => {
      const el = entry.target
      if (entry.isIntersecting && !el.classList.contains('is-visible')) {
        counter_1(el, {
          duration: 1500,
          delay: 16,
        })
        el.classList.add('is-visible')
      }
    })
  }

  const counter_1_io = new IntersectionObserver(counter_cb, {
    threshold: 1
  })

  const counter_1_els = document.querySelectorAll('.counter-active');
  counter_1_els.forEach((el) => {
    counter_1_io.observe(el)
  });
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 08. Testimonial Slider | Home 1
  var testimonial_slider = new Swiper(".testimonial__slider", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
  });
  ////////////////////////////////////////////////////


  ////////////////////////////////////////////////////
  // 09. Testimonial Slider | Home 2
  var slider = new Swiper('.main-slider', {
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    speed: 1500,
    loopedSlides: 6,
    navigation: {
      nextEl: '.btn-next',
      prevEl: '.btn-prev',
    },
  });

  var thumbs = new Swiper('.slider-thumbs', {
    slidesPerView: 3,
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,
    speed: 1500,
    slideToClickedSlide: true,
  });

  slider.controller.control = thumbs;
  thumbs.controller.control = slider;
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 10. Team Slider
  var team_slider = new Swiper(".team__slider", {
    'freemode': true,
    'slidesPerView': 1,
    'spaceBetween': 30,
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
      1300: {
        slidesPerView: 4,
      },
    },
  });
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 11. MixitUp activation
  let mixit_active = document.querySelector('.mixit-active');
  if (mixit_active) {
    var mixer = mixitup('.mixit-active');
  }
  /////////////////////////////////////////////////////


  /////////////////////////////////////////////////////
  // 12. WOW JS Activation
  var wow_js = new WOW({
    animateClass: 'animated',
    mobile: true,
  });
  wow_js.init();
  /////////////////////////////////////////////////////


  jQuery(document).ready(function () {

    /////////////////////////////////////////////////////
    // 13. Mobile Menu Activation
    $('.offcanvas-menu').meanmenu({
      meanScreenWidth: "1365",
      meanMenuContainer: '.offcanvas__menu',
      meanMenuCloseSize: '24px',
    });
    /////////////////////////////////////////////////////


    /////////////////////////////////////////////////////
    // 14. ProgressBar activation
    $('.exp-active').progressBar({
      animation: true,
      height: "8",
      barColor: "#ff4904",
    });
    /////////////////////////////////////////////////////


    /////////////////////////////////////////////////////
    // 14. Price Table
    var price_type = $('.price-type');

    price_type.on('click', function () {
      if (price_type.is(":checked")) {
        $(".monthly_price").hide();
        $(".yearly_price").show();
      } else {
        $(".monthly_price").show();
        $(".yearly_price").hide();
      }
    });

    /////////////////////////////////////////////////////


    /////////////////////////////////////////////////////
    // 15. Price Table 2
    var price_type_2 = $('.package__duration-2 button');

    price_type_2.on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      var text = $(this).text().toLowerCase();

      if (text == 'yearly') {
        $(".monthly_price").hide();
        $(".yearly_price").show();
      } else {
        $(".monthly_price").show();
        $(".yearly_price").hide();
      }
    });
    /////////////////////////////////////////////////////

  });


})(jQuery);

// Typing Animation

const textDisplay = document.getElementById('typing-animation')
const phrases = ['Accounting & Bookkeeping', 'GST', 'Income Tax', 'Payroll Management', 'Corporate Secretarial', 'Statutory & other Compliance', 'Outsourcing', 'Cost & works Compliance', 'Startup Registration (5 Types)', 'Business Valuation', 'IPR', 'Mergers & Aquisitions'];
let i = 0
let j = 0
let currentPhrase = []
let isDeleting = false
let isEnd = false

function loop() {
  isEnd = false
  textDisplay.innerHTML = currentPhrase.join('')

  if (i < phrases.length) {

    if (!isDeleting && j <= phrases[i].length) {
      currentPhrase.push(phrases[i][j])
      j++
      textDisplay.innerHTML = currentPhrase.join('')
    }

    if (isDeleting && j <= phrases[i].length) {
      currentPhrase.pop(phrases[i][j])
      j--
      textDisplay.innerHTML = currentPhrase.join('')
    }

    if (j == phrases[i].length) {
      isEnd = true
      isDeleting = true
    }

    if (isDeleting && j === 0) {
      currentPhrase = []
      isDeleting = false
      i++
      if (i === phrases.length) {
        i = 0
      }
    }
  }
  const spedUp = Math.random() * (80 - 50) + 50
  const normalSpeed = Math.random() * (300 - 200) + 200
  const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed
  setTimeout(loop, time)
}

loop()