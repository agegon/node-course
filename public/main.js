document.querySelectorAll('.price').forEach(node => {
  node.textContent = new Intl.NumberFormat('ru-Ru', {
    currency: 'rub',
    style: 'currency'
  }).format(node.textContent);
})

const $card = document.querySelector('#card');
if ($card) {
  $card.addEventListener('click', ({ target }) => {
    if (target.classList.contains('js-remove')) {
      const { id } = event.target.dataset;
      if (id) {
        fetch(`/card/${id}`, { method: 'delete' })
          .then(res => res.json())
          .then(data => console.log(data))
          .catch(err => console.log(err))
      }
    }
  })
}
