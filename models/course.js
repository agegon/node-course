const fs = require('fs');
const path = require('path');

class Course {
  static coursesPath = path.join(__dirname, '..', 'data', 'courses.json');
  
  constructor({ title, price, img }) {
    this.title = title;
    this.price = price;
    this.img = img;
  }

  async save() {
    const courses = await Course.getAll();
    const id = (courses.map(course => course.id).sort((a, b) => b - a)[0] + 1) || 1;
    courses.push({
      id,
      title: this.title,
      price: this.price,
      img: this.img,
    });

    return new Promise((resolve, reject) => {
      fs.writeFile(
        Course.coursesPath, 
        JSON.stringify(courses), 
        err => {
          if (err) return reject(err);
          resolve();
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => 
      fs.readFile(Course.coursesPath, 'utf-8', (err, data) => {
        if (err) return reject(err);
        resolve(JSON.parse(data));
      })
    );
  }
}

module.exports = Course;
