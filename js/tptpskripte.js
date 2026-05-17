/* js/tptpskripte.js
   Jednostavan JavaScript za validaciju forme, tamnu temu, filtriranje i statistiku
*/

// Regularni izrazi za provjeru formata (moraju ostati zbog pravila projekta)
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var telefonRegex = /^[0-9\s-]+$/;

// 1. FUNKCIJA ZA TAMNU TEMU
function initThemeToggle() {
    var dugme = document.getElementById('theme-toggle');
    if (!dugme) return;

    // Provjeravamo da li je u memoriji vec zapamcena tamna tema
    var sacuvanaTema = localStorage.getItem('tptp-theme');
    if (sacuvanaTema === 'dark') {
        document.body.classList.add('dark');
    }

    // Kada korisnik klikne na dugme za temu
    dugme.addEventListener('click', function() {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            localStorage.setItem('tptp-theme', 'light'); // Pamti svjetlo
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('tptp-theme', 'dark'); // Pamti tamno
        }
    });
}

// 2. FUNKCIJA ZA VALIDACIJU FORME (Kada se klikne dugme Pošalji)
function validateForm(event) {
    event.preventDefault(); // Zaustavi automatsko osvezavanje stranice

    // Hvatanje svih polja iz forme preko njihovih ID-jeva
    var ime = document.getElementById('ime');
    var prezime = document.getElementById('prezime');
    var email = document.getElementById('email');
    var telefon = document.getElementById('telefon');
    var tema = document.getElementById('tema');
    var poruka = document.getElementById('poruka');

    var isValid = true;

    // Prvo ocistimo sve stare greske ako su postojale
    var sveGreske = document.querySelectorAll('.error-message');
    for (var i = 0; i < sveGreske.length; i++) {
        sveGreske[i].textContent = '';
    }
    var sviInputi = document.querySelectorAll('input, textarea, select');
    for (var j = 0; j < sviInputi.length; j++) {
        sviInputi[j].classList.remove('invalid');
    }

    // Provjera polja: Ime
    if (ime.value.trim() === '') {
        document.getElementById('ime-error').textContent = 'Unesite vaše ime.';
        ime.classList.add('invalid');
        isValid = false;
    }

    // Provjera polja: Prezime
    if (prezime.value.trim() === '') {
        document.getElementById('prezime-error').textContent = 'Unesite vaše prezime.';
        prezime.classList.add('invalid');
        isValid = false;
    }

    // Provjera polja: Email
    if (email.value.trim() === '') {
        document.getElementById('email-error').textContent = 'Unesite email adresu.';
        email.classList.add('invalid');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        document.getElementById('email-error').textContent = 'Email adresa nije u ispravnom formatu.';
        email.classList.add('invalid');
        isValid = false;
    }

    // Provjera polja: Telefon
    if (telefon.value.trim() === '') {
        document.getElementById('telefon-error').textContent = 'Unesite broj telefona.';
        telefon.classList.add('invalid');
        isValid = false;
    } else if (!telefonRegex.test(telefon.value.trim())) {
        document.getElementById('telefon-error').textContent = 'Telefon smije sadržavati samo cifre, razmake i crtice.';
        telefon.classList.add('invalid');
        isValid = false;
    }

    // Provjera polja: Tema upita (Dropdown)
    if (tema.value === '') {
        document.getElementById('tema-error').textContent = 'Odaberite temu vašeg upita.';
        tema.classList.add('invalid');
        isValid = false;
    }

    // Provjera polja: Poruka
    if (poruka.value.trim() === '') {
        document.getElementById('poruka-error').textContent = 'Unesite tekst poruke.';
        poruka.classList.add('invalid');
        isValid = false;
    }

    // AKO JE SVE ISPRAVNO POPUNJENO
    if (isValid) {
        var prozorZaUspeh = document.getElementById('contact-success');
        var tekstPoruke = document.getElementById('success-text');

        if (prozorZaUspeh && tekstPoruke) {
            tekstPoruke.textContent = 'Hvala, ' + ime.value.trim() + '! Vaš upit je uspješno primljen.';
            prozorZaUspeh.style.display = 'flex';
        }

        document.getElementById('contact-form').reset();
    }
}

// 3. FUNKCIJA ZA DINAMIČKO FILTRIRANJE KARTICA
function initCardFiltering() {
    var filterDugmad = document.querySelectorAll('[data-filter]');
    var kartice = document.querySelectorAll('.card');
    if (!filterDugmad.length || !kartice.length) {
        return;
    }

    for (var i = 0; i < filterDugmad.length; i++) {
        filterDugmad[i].addEventListener('click', function() {
            var filterVrijednost = this.getAttribute('data-filter');
            var vidljivoKartica = 0;

            // Prolazimo kroz sve kartice i gledamo da li se poklapaju sa filterom
            for (var j = 0; j < kartice.length; j++) {
                var kategorijaKartice = kartice[j].getAttribute('data-category') || '';

                if (filterVrijednost === 'all' || kategorijaKartice.indexOf(filterVrijednost) !== -1) {
                    kartice[j].style.display = 'block'; // Prikaži karticu
                    vidljivoKartica++;
                } else {
                    kartice[j].style.display = 'none'; // Sakrij karticu
                }
            }

            // INTERAKTIVNA STATISTIKA: Odmah azuriramo brojač na ekranu
            var brojac = document.getElementById('active-count');
            if (brojac) {
                brojac.textContent = vidljivoKartica;
            }

            // Promjena aktivnog izgleda dugmeta
            for (var k = 0; k < filterDugmad.length; k++) {
                filterDugmad[k].classList.remove('active');
            }
            this.classList.add('active');
        });
    }
}

// 4. FUNKCIJA ZA GLATKO SKROLOVANJE (Smooth Scroll)
function initSmoothScroll() {
    var linkovi = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < linkovi.length; i++) {
        linkovi[i].addEventListener('click', function(event) {
            var hrefAtribut = this.getAttribute('href');
            if (hrefAtribut === '#') return;

            var metaId = hrefAtribut.substring(1); // Uzima sve posle znaka #
            var metaElement = document.getElementById(metaId);

            if (metaElement) {
                event.preventDefault(); // Sprijeci nagli skok
                metaElement.scrollIntoView({ behavior: 'smooth' }); // Skroluj glatko
            }
        });
    }

    var dugmad = document.querySelectorAll('button[data-scroll]');
    for (var j = 0; j < dugmad.length; j++) {
        dugmad[j].addEventListener('click', function() {
            var cilj = this.getAttribute('data-scroll');
            if (!cilj) return;
            var metaElement = document.querySelector(cilj);
            if (metaElement) {
                metaElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function initButtonNavigation() {
    var navigacija = document.querySelectorAll('button[data-href]');
    for (var k = 0; k < navigacija.length; k++) {
        navigacija[k].addEventListener('click', function() {
            var destinacija = this.getAttribute('data-href');
            if (destinacija) {
                window.location.href = destinacija;
            }
        });
    }
}

// 5. INICIJALIZACIJA BROJAČA KARTICA PRI UČITAVANJU
function initInteractiveCounter() {
    var brojac = document.getElementById('active-count');
    var kartice = document.querySelectorAll('.card');
    if (brojac && kartice) {
        brojac.textContent = kartice.length; // Postavlja ukupan broj na pocetku
    }
}

// GLAVNO POKRETANJE SVIH FUNKCIJA KADA SE STRANICA UCITA
window.onload = function() {
    initThemeToggle();
    initCardFiltering();
    initSmoothScroll();
    initButtonNavigation();
    initInteractiveCounter();

    // Povezivanje forme sa funkcijom za validaciju
    var forma = document.getElementById('contact-form');
    if (forma) {
        forma.addEventListener('submit', validateForm);

        // Ako korisnik sam klikne dugme Reset, ocisti i sve ispise gresaka
        forma.addEventListener('reset', function() {
            var sveGreske = document.querySelectorAll('.error-message');
            for (var i = 0; i < sveGreske.length; i++) {
                sveGreske[i].textContent = '';
            }
            var sviInputi = document.querySelectorAll('input, textarea, select');
            for (var j = 0; j < sviInputi.length; j++) {
                sviInputi[j].classList.remove('invalid');
            }
        });
    }

    var dugmeZatvori = document.getElementById('modal-zatvori-btn');
    if (dugmeZatvori) {
        dugmeZatvori.addEventListener('click', function() {
            var prozorZaUspeh = document.getElementById('contact-success');
            if (prozorZaUspeh) {
                prozorZaUspeh.style.display = 'none';
            }
        });
    }
};