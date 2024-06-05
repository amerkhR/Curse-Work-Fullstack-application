const express = require("express");
const cors = require("cors");
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./resumes/upload_files")
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "." + file.originalname.split('.').pop())

  }
})

const upload = multer({ storage: storage });
const app = express();

app.post('/api/test/vac_response', upload.single('resume'), (req, res) => {
  
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    } else if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен'});
    }
    res.status(200).json({ message: 'Файл успешно загружен' });
  } catch (error) {
    
    res.status(500).json({ message: 'Произошла ошибка сервера' });
  }
});

var bcrypt = require("bcryptjs");


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const Agr = db.agr;
const Vacancy = db.vacancy;
const Help = db.help;
const Vac_responce = db.vac_response

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/agr.routes')(app);
require('./app/routes/vacancy.routes')(app);
require('./app/routes/help.routes')(app);
require('./app/routes/vac_response.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Agr.create({
    name: "Agr1",
    status: "Active"
  }).then(() => {
    console.log("Agr1 created successfully.");
  });

  Agr.create({
    name: "Agr2",
    status: "Inactive"
  }).then(() => {
    console.log("Agr2 created successfully.");
  });

  Agr.create({
    name: "Agr3",
    status: "Pending"
  }).then(() => {
    console.log("Agr3 created successfully.");
  });

  Vacancy.create({
    name: "Frondend-developer",
    company: "Yandex",
    salary: "400$"
  }).then(() => {
    console.log("First vacancy created seccessfully")
  })

  Vacancy.create({
    name: "QA-engineer",
    company: "VK",
    salary: "100$"
  }).then(() => {
    console.log("Second vacancy created seccessfully")
  })

  Vacancy.create({
    name: "HR-manager",
    company: "MAIL.RU",
    salary: "100$"
  }).then(() => {
    console.log("Third vacancy created seccessfully")
  })

  Help.create({
    username: "Said",
    contact: "said@aue.com",
    description: "bolh bec ukho"
  }).then(() => {
    console.log("Firs help bid created seccuessfully")
  })
  const fs = require('fs');
  fs.readFile("C:\\Users\\ramer\\Downloads\\prakt7-8\\prakt7-8\\server\\resumes\\resume.docx", (err, data) => {
    if (err) throw err;

    const base64file = data.toString("base64")

    Vac_responce.create({
      vacancy_id: 1,
      contact: "@r_amerkh",
      message: "Vozmite na raboty poshaluista",
      resume: base64file
    })
    .then(() => {
      console.log('Резюме успешно сохранено.');
    })
    .catch(err => {
      console.error('Ошибка при сохранении резюме:', err);
    });
  })
 

  Role.create({
    id: 1,
    name: "user"
  }).then(() => {
    Role.create({
      id: 2,
      name: "moderator"
    }).then(() => {
      Role.create({
        id: 3,
        name: "admin"
      }).then(() => {
        const User = db.user;
        User.create({
          username: "user",
          email: "user@example.com",
          password: bcrypt.hashSync("123321", 8)
        }).then((user1) => {
          user1.setRoles([1]).then(() => {
            console.log("User 1 with role 'user' created successfully.");
          });
        });

        User.create({
          username: "mod",
          email: "mod@gmail.com",
          password: bcrypt.hashSync("123321", 8)
        }).then((user2) => {
          user2.setRoles([1, 2]).then(() => {
            console.log("User 2 with role 'moderator' created successfully.");
          });
        });

        User.create({
          username: "admin",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("123321", 8)

        }).then((user3) => {
          user3.setRoles([1, 2, 3]).then(() => {
            console.log("User 3 with role 'admin' created successfully.");
          });
        });
      });
    });
  });
}