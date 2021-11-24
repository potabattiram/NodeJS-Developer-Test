const express = require("express");
const Router = express.Router();
const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createArrayCsvWriter;

// ABLE TO READ DATA FROM CSV FILE, PASSING PARAMETERS AS BOOKS, AUTHORS & MAGAZINES
Router.get("/getdata/:data", (req, res) => {
  const data = req.params.data;
  const csvFilePath = `./Data/${data}.csv`;
  csv()
    .fromFile(csvFilePath)
    .then((Obj) => {
      res.status(200).send(Obj);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// ABLE TO GET DATA BY ISBN, PASS BOOKS, MAGAZINES & ALSO PASS ISBN AS PARAMETER 
Router.get("/getdatabyisbn/:data/:isbn", (req, res) => {
  const data = req.params.data;
  const isbn = req.params.isbn;
  const csvFilePath = `./Data/${data}.csv`;
  csv()
    .fromFile(csvFilePath)
    .then((Obj) => {
      const filteredData = Obj.map((item) => {
        if (item.isbn === isbn) {
          return {
            item: item ? item : null,
          };
        } else {
          return null;
        }
      });
      const filteredData2 = filteredData.filter((item) => item !== null);
      res.send(filteredData2);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// ABLE TO GET DATA BY EMAIL OF AUTHORS, WHICH ARE INCLUDED IN BOOKS, MAGAZINES, WE NEED TO PASS EMAIL AND DATA-FILENAME AS PARAMETER
Router.get("/getdatabyemail/:data/:email", (req, res) => {
  const data = req.params.data;
  const email = req.params.email;
  const csvFilePath = `./Data/${data}.csv`;
  csv()
    .fromFile(csvFilePath)
    .then((Obj) => {
      const filteredData = Obj.map((item) => {
        if (item.authors === email) {
          return {
            item: item ? item : null,
          };
        } else {
          return null;
        }
      });
      const filteredData2 = filteredData.filter((item) => item !== null);
      res.send(filteredData2);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// SORTS THE DATA ACCORDING TO BOOKS TITLE AND MAGAZINES TITLE
Router.get("/getsorteddata", (req, res) => {
  const BooksCsv = `./Data/Books.csv`;
  const MagazinesCsv = `./Data/Magazines.csv`;

  csv()
    .fromFile(BooksCsv)
    .then((Obj) => {
      const sortedBooks = Obj.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      csv()
        .fromFile(MagazinesCsv)
        .then((Obj2) => {
          const sortedMagazines = Obj2.sort((a, b) => {
            return a.title.localeCompare(b.title);
          });
          const bigArry = sortedBooks.concat(sortedMagazines);
          const data = bigArry.sort((a, b) => {
            return a.title.localeCompare(b.title);
          });
          res.send(data);
        });
    });
});

// POST REQUEST WHICH IS CAN ADD-DATA TO CSV FILE
Router.post("/adddata", (req, res) => {
  const book = req.body.book;
  const magazine = req.body.magazine;

  const csvWriter = createCsvWriter({
    header: ["Book Name", "Magazine Name"],
    path: "./newfile.csv",
  });

  const records = [[book, magazine]];
  if (book === null || magazine === null) {
    res.send("Please enter a book or magazine name");
  } else {
    csvWriter
      .writeRecords(records)
      .then((success) => {
        res.send("success");
      })
      .catch((err) => {
        res.send("Error");
      });
  }
});


module.exports = Router;
