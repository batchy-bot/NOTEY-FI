const fs = require('fs');

let rawdata = fs.readFileSync('C:/Users/Kyle/Desktop/VS CODE/Thesis/Gclassroom New/course_work_data.json');
let course_data = JSON.parse(rawdata);

for (let data of course_data){
    for (let item in data){
        console.log(item+": "+data[item])
    }
}