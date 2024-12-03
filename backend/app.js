require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

//Body Parser
app.use(bodyParser.json)

//Routes
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

//Database connection
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (error) => console.error("db error ::: ",error.message))
db.once('open', () => {
    console.log("database connected...")
    app.listen(PORT, () => console.log("Server started @ http://localhost:"+PORT));
})
