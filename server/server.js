const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@1234",
    database: "finalyear",
})

app.post('/add_job', (req, res) => {
    const sql = "INSERT INTO jobs (`id`,`name`,`type`,`loc`,`exp`) VALUES (?, ?, ?, ?, ?)";
    const values = [
        req.body.id,
        req.body.name,
        req.body.type,
        req.body.loc,
        req.body.exp,
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding job:", err);
            return res.status(500).json({ error: "Failed to add job" });
        }
        return res.json({ success: "Job added successfully" });
    });
});


app.get('/posts', (req, res)=>{
    const sql = "SELECT * FROM jobs";
    db.query(sql, (err, result)=>{
        if(err) res.json(err)
        return res.json(result)
    })
})

app.get('/get_post/:id', (req, res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM jobs WHERE `id`=?";
    db.query(sql,[id], (err, result)=>{
        if(err) res.json(err)
        return res.json(result)
    })
})

app.post('/edit_job/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE jobs SET `name`=?, `type`=?, `loc`=?, `exp`=? WHERE id=?";
    const values = [
        req.body.name,
        req.body.type,
        req.body.loc,
        req.body.exp,
        id
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error editing job:", err);
            return res.status(500).json({ error: "Failed to edit job" });
        }
        return res.json({ success: "Job edited successfully" });
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM jobs WHERE id=?";
    const values = [id];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error deleting job:", err);
            return res.status(500).json({ error: "Failed to delete job" });
        }
        return res.json({ success: "Job deleted successfully" });
    });
});

app.listen(port, ()=>{
    console.log('listening')
})