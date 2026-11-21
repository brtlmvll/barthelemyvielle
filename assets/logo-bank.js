(()=>{
const controls=[...document.querySelectorAll('[data-logo-tone]')];
controls.forEach(button=>button.addEventListener('click',()=>{
  document.body.classList.toggle('bank-white',button.dataset.logoTone==='white');
  controls.forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
}));
})();
