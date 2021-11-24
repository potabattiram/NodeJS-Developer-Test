const express = require('express');
const app = express();
const dataReadAPI = require("./Controllers/dataReadAPI");
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin:"*",
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true,
    preflightContinue:false,
    optionsSuccessStatus:200
}))

app.use(dataReadAPI);

app.listen(9090, () => {
    console.log('Server is running on port 9090');
})