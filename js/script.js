
function initSmoothScroll() {
    // Общая функция для всех страниц
    const scrollToTarget = (hash, isInitial = false) => {
        const target = document.querySelector(decodeURIComponent(hash));
        
        if (!target) {
            if (!isInitial) console.warn('Target element not found:', hash);
            return;
        }

        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        // Плавный скролл с учетом хедера
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Для SEO и истории
        if (!isInitial) {
            history.replaceState(null, null, hash);
        }
    };

    // Обработчик кликов
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        e.preventDefault();
        const hash = new URL(link.href).hash;
        if (hash) scrollToTarget(hash);
    });

    // Обработка начального хеша
    window.addEventListener('load', () => {
        if (window.location.hash) {
            scrollToTarget(window.location.hash, true);
        }
    });

    // Полифилл для Safari и старых браузеров
    if (!('scrollBehavior' in document.documentElement.style)) {
        const smoothScroll = (targetPosition) => {
            const start = window.pageYOffset;
            const distance = targetPosition - start;
            const duration = 800;
            let startTime = null;

            const animate = currentTime => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easeInOutQuad(progress);
                
                window.scrollTo(0, start + (distance * ease));
                
                if (progress < 1) requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        };

        const easeInOutQuad = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

        // Переопределение обработчика
        document.body.addEventListener('click', e => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            const hash = new URL(link.href).hash;
            const target = document.querySelector(decodeURIComponent(hash));
            
            if (target) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                smoothScroll(targetPosition);
            }
        });
    }

    // Совместимость с History API
    window.addEventListener('popstate', e => {
        if (window.location.hash) {
            scrollToTarget(window.location.hash, true);
        }
    });
}

function initIntersectionObserver() {
    const photos = document.querySelectorAll(".back--photo img");
    if (!photos.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("visible", entry.isIntersecting);
        });
    }, {
        threshold: 0.3
    });

    photos.forEach(photo => observer.observe(photo));
}

function initParallaxEffects() {
    // Ваш существующий код параллакса
    // Добавьте сюда код из оригинального скрипта
    // ...
}

function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav__list');
    if (!menuToggle || !navList) return;

    const toggleMenu = (state) => {
        menuToggle.classList.toggle('active', state);
        navList.classList.toggle('active', state);
        document.body.classList.toggle('no-scroll', state);
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(!menuToggle.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__nav')) toggleMenu(false);
    });

    document.querySelectorAll('.nav__list a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const photos = document.querySelectorAll(".back--photo img");

    // Настройки Intersection Observer
    const options = {
        root: null, // Отслеживаем относительно viewport
        threshold: 0.3 // Запуск анимации, когда 30% изображения в зоне видимости
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible"); // Показываем фото
            } else {
                entry.target.classList.remove("visible"); // Скрываем фото при прокрутке вверх
            }
        });
    }, options);

    photos.forEach(photo => observer.observe(photo));
});


document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll(
        'img[src="./img/work_header/w8.jpg"], .img__heating img'
    );
    
    let scrollPos = window.pageYOffset;
    const sensitivity = 0.2; // Уменьшаем чувствительность
    const maxMovement = 15; // Уменьшаем максимальное смещение
    let rafId = null;

    function animate() {
        const currentScroll = window.pageYOffset;
        const scrollDelta = currentScroll - scrollPos;
        
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            
            // Рассчитываем позицию относительно центра экрана
            const distanceFromCenter = rect.top + rect.height/2 - viewportCenter;
            const normalizedDistance = distanceFromCenter / viewportCenter;
            
            // Плавное смещение с ограничением
            let offset = scrollDelta * sensitivity * Math.sin(normalizedDistance * Math.PI);
            offset = Math.max(-maxMovement, Math.min(offset, maxMovement));
            
            // Плавное применение трансформации
            const currentY = parseFloat(img.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
            const newY = currentY * 0.9 + offset * 0.8;
            
            img.style.transform = `translateY(${newY}px)`;
        });

        scrollPos = currentScroll;
        rafId = requestAnimationFrame(animate);
    }

    // Запускаем анимацию только при скролле
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            rafId = requestAnimationFrame(animate);
        }
    });

    // Останавливаем анимацию через 100ms после остановки скролла
    window.addEventListener('scroll', () => {
        clearTimeout(window.scrollEndTimer);
        window.scrollEndTimer = setTimeout(() => {
            cancelAnimationFrame(rafId);
            isScrolling = false;
        }, 100);
    });
});

document.querySelectorAll('.master').forEach(master => {
    master.addEventListener('click', function(e) {
        if(window.innerWidth > 768) {
            e.preventDefault();
            // Дополнительная анимация перед переходом
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                window.location = this.querySelector('a').href;
            }, 300);
        }
    });
});

// Добавляем обработчики событий
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav__list');

// Открытие/закрытие меню
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
    
    // Блокировка скролла
    document.body.classList.toggle('no-scroll');
});

// Закрытие меню при клике вне области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__nav') && !e.target.closest('.menu-toggle')) {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});


const BOT_TOKEN = '7572761165:AAGFlHq3UqeYSLbJc9HmqbDVolgMJBXinAc';
const CHAT_IDS = ['679870401', '5385886642'];
const COOLDOWN_TIME = 5 * 60 * 1000; // 20 минут в миллисекундах

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('callbackModal');
    const form = document.getElementById('callbackForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    let isSending = false;

    // Функция показа оставшегося времени
    const showTimeLeft = () => {
        const lastSent = localStorage.getItem('lastFormSent');
        if (!lastSent) return;

        const timeLeft = COOLDOWN_TIME - (Date.now() - lastSent);
        if (timeLeft > 0) {
            const minutes = Math.ceil(timeLeft / 60000);
            alert(`До наступної відправки залишилось: ${minutes} хвилин`);
        }
    };

    // Общие функции
    const showModal = () => {
        if (isOnCooldown()) {
            showTimeLeft();
            return;
        }
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('visible'), 10);
    };

    const hideModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    // Проверка временного ограничения
    const isOnCooldown = () => {
        const lastSent = localStorage.getItem('lastFormSent');
        return lastSent && Date.now() - lastSent < COOLDOWN_TIME;
    };

    // Обновление времени последней отправки
    const updateCooldown = () => {
        localStorage.setItem('lastFormSent', Date.now());
    };

    // Обработчики открытия
    document.querySelectorAll('.button, .callback-btn, .button__extreme--healting button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    });

    // Обработчики закрытия
    document.querySelector('.close').addEventListener('click', hideModal);
    
    window.addEventListener('click', (e) => {
        if(e.target === modal) hideModal();
    });

    // Функция отправки в Telegram
    const sendToTelegram = async (message) => {
        try {
            const requests = CHAT_IDS.map(chat_id => 
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ chat_id, text: message })
                })
            );
            
            const responses = await Promise.all(requests);
            return responses.filter(r => r.ok).length;
            
        } catch (error) {
            console.error('Помилка відправки:', error);
            return 0;
        }
    };

    // Отправка формы
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isOnCooldown()) {
            showTimeLeft();
            return;
        }

        if (isSending) return;
        isSending = true;
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const message = `Новий запит!\nІм'я: ${formData.get('name')}\nТелефон: ${formData.get('phone')}\nInstagram: ${formData.get('instagram')}`;

            const successfulCount = await sendToTelegram(message);
            
            if (successfulCount > 0) {
                updateCooldown();
                alert(successfulCount === CHAT_IDS.length 
                    ? 'Ваш запит успішно відправлено!' 
                    : `Повідомлення надіслано ${successfulCount} з ${CHAT_IDS.length} одержувачів`);
                
                form.reset();
                hideModal();
            } else {
                alert('Сталася помилка під час відправки!');
            }
            
        } catch (error) {
            alert('Критична помилка: ' + error.message);
        } finally {
            isSending = false;
            submitBtn.disabled = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav__list a');
    const currentPage = window.location.pathname;

    // Функция установки активной ссылки
    function setActiveLink() {
        navLinks.forEach(link => link.classList.remove('active')); // Убираем активные классы у всех

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            // Если ссылка совпадает с текущей страницей, делаем её активной
            if (linkPath === currentPage || (currentPage === '/' && linkPath === '/index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Обновление активной ссылки при клике
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active')); // Убираем активные классы у всех
            this.classList.add('active'); // Делаем активной только нажатую кнопку
        });

        // Анимация при наведении
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Устанавливаем активную ссылку при загрузке
    setActiveLink();
});


document.addEventListener("DOMContentLoaded", function () {
    const parallaxLeft = document.querySelector(".parallax-left");
    const parallaxRight = document.querySelector(".parallax-right");
    
    // Проверяем существование элементов
    if (!parallaxLeft || !parallaxRight) return;

    const parallaxSpeed = 0.2;
    let animationFrameId = null;

    // Функция обновления позиций
    const updateParallax = () => {
        const scrollPosition = window.scrollY || window.pageYOffset;
        
        parallaxLeft.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
        parallaxRight.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
        
        animationFrameId = null;
    };

    // Оптимизированный обработчик скролла
    const handleScroll = () => {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateParallax);
        }
    };

    // Добавляем обработчик
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Инициализация при загрузке
    updateParallax();

    // Убираем обработчик при unmount (если нужно)
    return () => {
        window.removeEventListener("scroll", handleScroll);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
});


document.addEventListener('DOMContentLoaded', () => {
    const parallaxImages = document.querySelectorAll('.field__parallax-image');
    const parallaxWrapper = document.querySelector('.field__parallax-wrapper');
    let isMobile = window.matchMedia("(max-width: 768px)").matches;
    let animationFrameId = null;

    // Параметры анимации
    const parallaxSettings = {
        minSpeed: 0.15,  // Минимальная скорость перемещения
        maxSpeed: 0.3,   // Максимальная скорость перемещения
        maxOffset: 100   // Максимальное смещение в пикселях
    };

    // Рассчитываем смещение для каждого изображения
    const updateParallax = () => {
        if(isMobile || !parallaxWrapper) return;

        const wrapperRect = parallaxWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Рассчитываем прогресс скролла внутри блока
        const wrapperTop = scrollY + wrapperRect.top;
        const wrapperBottom = wrapperTop + wrapperRect.height;
        const scrollProgress = (scrollY - wrapperTop + viewportHeight) / 
                             (viewportHeight + wrapperRect.height);

        parallaxImages.forEach((img, index) => {
            // Разная скорость для каждого изображения
            const speedFactor = index === 0 ? 0.8 : 1.2;
            const speed = parallaxSettings.minSpeed + 
                        (parallaxSettings.maxSpeed - parallaxSettings.minSpeed) * 
                        (index / (parallaxImages.length - 1));
            
            // Плавное появление/исчезание эффекта у границ
            const opacity = Math.min(1, 
                Math.max(0, 
                    (scrollY - wrapperTop + viewportHeight * 0.5) / 
                    (viewportHeight * 0.5)
                )
            );

            // Рассчитываем смещение
            const offset = scrollProgress * parallaxSettings.maxOffset * speed * speedFactor;
            
            // Применяем трансформации
            img.style.transform = `translateY(${offset}px)`;
            img.style.opacity = opacity.toFixed(2);
        });

        animationFrameId = requestAnimationFrame(updateParallax);
    };

    // Обработчик скролла
    const handleScroll = () => {
        if(!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateParallax);
        }
    };

    // Обработчик изменения размера
    const handleResize = () => {
        isMobile = window.matchMedia("(max-width: 768px)").matches;
    };

    // Инициализация
    const init = () => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        updateParallax();
    };

    // Отключение эффекта на мобильных
    if(!isMobile) {
        init();
    }

    // Очистка
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if(animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.benefits__item-number');

    // Функция для анимации счета
    const animateCounter = (element) => {
        const target = +element.getAttribute('data-count'); // Число из атрибута data-count
        let count = 0;
        const speed = target / 100; // Скорость увеличения, в данном случае за 100 шагов

        const counterInterval = setInterval(() => {
            count += speed;
            if (count >= target) {
                count = target;
                clearInterval(counterInterval); // Останавливаем анимацию
            }
            element.textContent = Math.round(count); // Обновляем текст
        }, 10); // Каждые 10ms
    };

    // Проверка, если элемент виден на экране
    const isInView = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    };

    // Функция для запуска анимации, если элементы в зоне видимости
    const handleScroll = () => {
        counters.forEach((counter) => {
            if (isInView(counter) && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    };

    // Добавляем событие scroll для отслеживания, когда счетчик должен начать анимацию
    window.addEventListener('scroll', handleScroll);

    // Инициализация на загрузке страницы
    handleScroll();
});


document.addEventListener("DOMContentLoaded", function() {
    const breadcrumbsContainer = document.querySelector('.breadcrumbs-container');
    const breadcrumbsElement = document.querySelector('.breadcrumbs-content');
    if (!breadcrumbsContainer || !breadcrumbsElement) return;

    // Получаем имя файла текущей страницы
    let path = window.location.pathname.split('/').pop();

    // Если это главная страница (пустой путь или "index.html"), скрываем контейнер хлебных крошек
    if (!path || path.toLowerCase() === 'index.html') {
        breadcrumbsContainer.style.display = "none";
        return;
    }

    // Иначе формируем хлебные крошки
    let pageName = path.replace('.html', '');
    pageName = pageName.replace(/[_-]/g, ' ');
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const breadcrumbHTML = '<a href="index.html">Головна</a> / <span>' + pageName + '</span>';
    breadcrumbsElement.innerHTML = breadcrumbHTML;
});


document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight * 0.3) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });
  
    // Плавный скролл вверх
    scrollBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  
    // Дополнительно: скролл для Safari
    if ('scrollBehavior' in document.documentElement.style === false) {
      scrollBtn.addEventListener('click', function() {
        const currentPosition = window.pageYOffset;
        const step = Math.max(currentPosition / 15, 20);
        
        function smoothScroll() {
          if (window.pageYOffset > 0) {
            window.scrollBy(0, -step);
            requestAnimationFrame(smoothScroll);
          }
        }
        smoothScroll();
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                      window.location.pathname === '/';

    // Добавляем проверку существования прелоадера
    if (!preloader) return;

    if(isHomePage) {
        document.body.classList.add('preloader-active');
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            document.body.classList.remove('preloader-active');
            
            // Добавляем проверку для main
            const main = document.querySelector('main');
            if (main) {
                main.style.opacity = '1';
                main.style.visibility = 'visible';
            }
            
            setTimeout(() => {
                preloader.remove();
            }, 200);
        }, 2000);
    } else {
        // Удаляем только если элемент существует
        preloader.remove();
    }
});
  
