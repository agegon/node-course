const fs = require('fs');
const path = require('path');

const cardPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'card.json'
);

class Card {
  static async getCard() {
    return new Promise((resolve, reject) => {
      fs.readFile(cardPath, 'utf-8', (err, content) => {
        if (err) return reject(err);
        resolve(JSON.parse(content));
      });
    });
  }

  static async clearCard() {
    const card = {
      courses: [],
      price: 0
    }

    Card.saveCard(card);
  }

  static async add(course) {
    const card = await Card.getCard();
    const idx = card.courses.findIndex(c => c.id === course.id);

    if (idx !== -1) {
      card.courses[idx].count++;
    } else {
      card.courses.push({
        id: course.id,
        count: 1
      });
    }

    card.price += parseFloat(course.price);

    Card.saveCard(card);    
  }

  static async remove({ id, price }) {
    id = Number(id);
    const card = await Card.getCard();
    const idx = card.courses.findIndex(item => item.id === id );
    if (idx !== -1) {
      if (card.courses[idx].count === 1) {
        card.courses = card.courses.filter(item => item.id !== id);
      } else {
        card.courses[idx].count--;
      }
      card.price -= Number(price);
      Card.saveCard(card);
    }
    return card;
  }

  static async saveCard(card) {
    return new Promise((resolve, reject) => {
      fs.writeFile(cardPath, JSON.stringify(card), err => {
        if (err) return reject(err);
        resolve(); 
      });
    });
  }
}

module.exports = Card;
