const toggleNavBtn = document.getElementById('toggleNav');
const menuEl = document.querySelector('.menu');

toggleNavBtn.addEventListener('click', () => {
  toggleNavBtn.classList.toggle('show');
  menuEl.classList.toggle('show');
});
