const fs = require('fs');
const path = require('path');

class Course {
  static coursesPath = path.join(__dirname, '..', 'data', 'courses.json');
  
  constructor({ title, price, img }) {
    this.course = { title, price, img }
  }

  async save() {
    const courses = await Course.getAll();
    const id = (courses.map(course => course.id).sort((a, b) => b - a)[0] + 1) || 1;
    this.course.id = id;
    courses.push(this.course);

    await Course.saveAll(courses);
  }

  async update(id) {
    const courses = await Course.getAll();
    const numId = parseInt(id);
    const courseIdx = courses.findIndex(crs => crs.id === numId);
    
    if (courseIdx !== -1) {
      courses[courseIdx] = { 
        ...courses[courseIdx],
        ...this.course 
      };
      await Course.saveAll(courses);
    }
  }

  static getAll() {
    return new Promise((resolve, reject) => 
      fs.readFile(Course.coursesPath, 'utf-8', (err, data) => {
        if (err) return reject(err);
        resolve(JSON.parse(data));
      })
    );
  }

  static saveAll(courses) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        Course.coursesPath, 
        JSON.stringify(courses), 
        err => {
          if (err) return reject(err);
          resolve();
        }
      )
    });
  }

  static async getById(id) {
    const courses = await Course.getAll();
    return courses.find(course => course.id === Number(id));
  }
}

module.exports = Course;
