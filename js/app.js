const toggleNavBtn = document.getElementById('toggleNav');
const menuEl = document.querySelector('.menu');

toggleNavBtn.addEventListener('click', () => {
  toggleNavBtn.classList.toggle('show');
  menuEl.classList.toggle('show');
  if (menuEl.classList.contains('smooth')) {
    setTimeout(() => {
      menuEl.classList.remove('smooth');
    }, 200);
  } else {
    menuEl.classList.add('smooth');
  }
});
