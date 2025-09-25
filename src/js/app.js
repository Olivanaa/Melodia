
function initializeSoundCloud() {
    const iframe = document.getElementById('soundcloud-player')

    if (typeof SC !== 'undefined' && SC.Widget) {
        widget = SC.Widget(iframe)

        widget.bind(SC.Widget.Events.READY, function () {
            console.log('SoundCloud player pronto!')
            setupPlayerControls()
        })
    } else {
        setTimeout(initializeSoundCloud, 1000)
    }
}

function setupPlayerControls() {
    const playBtn = document.querySelector('.play-btn')
    const likeBtn = document.querySelector('.like-btn')
    const player = document.querySelector('.music-player')

    if (!playBtn) {
        console.error('Botão play não encontrado!')
        return
    }

    playBtn.addEventListener('click', function () {
        if (!widget) {
            console.error('Widget do SoundCloud não inicializado!')
            return
        }

        widget.isPaused(function (paused) {
            if (paused) {
                widget.play()
                player.classList.add('playing')
                const icon = playBtn.querySelector('i')
                icon.classList.remove('fa-play')
                icon.classList.add('fa-pause')
            } else {
                widget.pause()
                player.classList.remove('playing')
                const icon = playBtn.querySelector('i')
                icon.classList.remove('fa-pause')
                icon.classList.add('fa-play')
            }
        })
    })

    likeBtn.addEventListener('click', function () {
        const icon = this.querySelector('i')
        if (icon.classList.contains('fa-regular')) {
            icon.classList.remove('fa-regular')
            icon.classList.add('fa-solid')
            this.classList.add('active')
        } else {
            icon.classList.remove('fa-solid')
            icon.classList.add('fa-regular')
            this.classList.remove('active')
        }
    })
}
document.addEventListener('DOMContentLoaded', function () {
    if (typeof SC === 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://w.soundcloud.com/player/api.js'
        script.onload = initializeSoundCloud
        document.head.appendChild(script)
    } else {
        initializeSoundCloud()
    }

    const navbar = document.getElementById('navbar')
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    const closeMobileMenu = document.getElementById('close-mobile-menu')
    const mobileMenu = document.getElementById('mobile-menu')
    const navLinks = document.querySelectorAll('a[href^="#"]')

    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.remove('navbar-transparent')
            navbar.classList.add('navbar-solid')
        } else {
            navbar.classList.remove('navbar-solid')
            navbar.classList.add('navbar-transparent')
        }
        updateActiveLink()
    }
    function updateActiveLink() {
        const sections = document.querySelectorAll('section')
        const scrollPos = window.scrollY + 100

        sections.forEach(section => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight
            const sectionId = section.getAttribute('id')

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active')
                })
                document.querySelector(`a[href="#${sectionId}"]`)?.classList.add('active')
            }
        })
    }
    function openMobileMenu() {
        mobileMenu.style.height = '100vh'
        document.body.style.overflow = 'hidden'
    }
    function closeMobileMenuHandler() {
        mobileMenu.style.height = '0'
        document.body.style.overflow = 'auto'
    }
    function smoothScroll(e) {
        e.preventDefault()
        const targetId = this.getAttribute('href')
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            })
            if (window.innerWidth < 768) {
                closeMobileMenuHandler()
            }
        }
    }
    window.addEventListener('scroll', handleScroll)
    mobileMenuButton.addEventListener('click', openMobileMenu)
    closeMobileMenu.addEventListener('click', closeMobileMenuHandler)

    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.classList.add('nav-link')
            link.addEventListener('click', smoothScroll)
        }
    })
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            closeMobileMenuHandler()
        }
    })
    handleScroll()
})

let widget = null

