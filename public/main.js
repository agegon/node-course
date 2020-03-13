const formatCurrency = el => 
  new Intl.NumberFormat('ru-Ru', {
    currency: 'rub',
    style: 'currency'
  }).format(el);

const formatDate = date => 
  new Intl.DateTimeFormat('ru-Ru', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));

document.querySelectorAll('.price').forEach(node => {
  node.textContent = formatCurrency(node.textContent);
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = formatDate(node.textContent);
})

const $card = document.querySelector('#card');
if ($card) {
  $card.addEventListener('click', ({ target }) => {
    if (target.classList.contains('js-remove')) {
      const { id } = target.dataset;
      if (id) {
        fetch(`/card/${id}`, { method: 'delete' })
          .then(res => res.json())
          .then(card => {
            if (card.courses.length > 0) {
              $card.querySelector('tbody').innerHTML = card.courses.map(c => `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td><button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button></td>
                </tr>
              `).join('');
              $card.querySelector('.price').innerHTML = formatCurrency(card.price);
            } else {
              $card.innerHTML = '<p>Корзина пуста.</p>';
            }
          })
          .catch(err => console.log(err))
      }
    }
  })
}


const $deleteBtn = document.querySelectorAll('.delete-course');
$deleteBtn.forEach(elem => 
  elem.addEventListener('click',
    ({ target }) => {
      const { id } = target.dataset;
      if (id) {
        fetch(`/courses/${id}`, { method: 'delete' })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            window.location.assign('/courses')
          })
          .catch(err => console.log('Error:', err))
      }
    }
  )
);
