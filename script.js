const loader = document.querySelector('#loader');
const loaderText = document.querySelector('.loader__text');
document.body.classList.add('is-loading');

let loading = 0;
const loadingTimer = setInterval(() => {
  loading = Math.min(100, loading + Math.ceil(Math.random() * 18));
  loaderText.textContent = `${loading}%`;
  if (loading >= 100) {
    clearInterval(loadingTimer);
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
    }, 220);
  }
}, 90);

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');

const updateHeader = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const cookieBanner = document.querySelector('#cookieBanner');
const acceptCookie = document.querySelector('#acceptCookie');
if (localStorage.getItem('cookieAccepted') === 'yes') {
  cookieBanner.classList.add('is-hidden');
}
acceptCookie.addEventListener('click', () => {
  localStorage.setItem('cookieAccepted', 'yes');
  cookieBanner.classList.add('is-hidden');
});

const steps = [...document.querySelectorAll('.quiz__step')];
const prevBtn = document.querySelector('#prevStep');
const nextBtn = document.querySelector('#nextStep');
const sendBtn = document.querySelector('#sendQuiz');
const quizStep = document.querySelector('#quizStep');
const quizBar = document.querySelector('#quizBar');
const quizForm = document.querySelector('#quizForm');
const quizThanks = document.querySelector('#quizThanks');
let currentStep = 0;

function showStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, idx) => step.classList.toggle('is-active', idx === currentStep));
  quizStep.textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
  quizBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  prevBtn.disabled = currentStep === 0;
  nextBtn.classList.toggle('is-hidden', currentStep === steps.length - 1);
  sendBtn.classList.toggle('is-hidden', currentStep !== steps.length - 1);
}

function validateStep() {
  const fields = [...steps[currentStep].querySelectorAll('input')];
  const required = fields.filter((field) => field.required);
  return required.every((field) => {
    if (field.type === 'radio') {
      return steps[currentStep].querySelector(`input[name="${field.name}"]:checked`);
    }
    if (field.type === 'checkbox') {
      return field.checked;
    }
    return field.value.trim();
  });
}

prevBtn.addEventListener('click', () => showStep(currentStep - 1));
nextBtn.addEventListener('click', () => {
  if (!validateStep()) {
    steps[currentStep].querySelector('input')?.reportValidity();
    return;
  }
  showStep(currentStep + 1);
});

quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  const data = Object.fromEntries(new FormData(quizForm).entries());
  localStorage.setItem('lastEventLead', JSON.stringify(data));
  quizThanks.classList.add('is-visible');
  quizForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

showStep(0);

document.querySelectorAll('.accordion button').forEach((button) => {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const accordion = button.closest('.accordion');
    const open = accordion.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
  });
});

const modal = document.querySelector('#videoModal');
const modalTitle = document.querySelector('#modalTitle');
document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.videoTitle;
    modal.showModal();
  });
});

document.querySelector('#closeVideo').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
