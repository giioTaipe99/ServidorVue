var express = require("express");
var session = require("express-session");
/*"File System" (Sistema de Archivos),
este módulo proporciona funciones para interactuar con el sistema de archivos del sistema operativo, como leer y escribir archivos*/
var fs = require("fs");
/*CORS es un mecanismo de seguridad implementado en navegadores web que restringe las solicitudes 
HTTP realizadas desde un dominio diferente al dominio del recurso.*/
var cors = require("cors");
const { stringify } = require("querystring");
var app = express()
const PORT = 3000

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("Server  =>" + PORT);
});

const preguntasFichero = "./preguntas.json";

app.get("/getPreguntas", (req, res) => {
    fs.readFile(preguntasFichero, 'UTF-8', (err, data) => {
        if (err) {
            console.log("No se puede leer el fichero");
        }
        else {
            const preguntas = JSON.parse(data);
            res.json(data);
        }
    })
});

app.post("/postPreguntas", (req, res) => {
    const nuevaPregunta = req.body;
    fs.readFile(preguntasFichero, 'utf-8', (err, data) => {
        if (err) {
            console.log("No se puede leer el fichero");
        }
        else {
            const preguntasObj = JSON.parse(data);
            const preguntasArray = preguntasObj.preguntas;

            preguntasArray.push(nuevaPregunta);

            fs.writeFile(preguntasFichero, JSON.stringify(preguntasObj), (err) => {
                if (err) {
                    res.status(500).json({ Error: "No se pudo escribir en el fichero." })
                }
                else {
                    res.json(preguntasArray);
                }
            })
        }
    });

});

app.delete("/:id", (req, res) => {
    console.log("entre");
    const idSelected = parseInt(req.params.id);
    fs.readFile(preguntasFichero, 'UTF-8', (err, data) => {
        if (err) {
            console.log("No se pudo leer el fichero.");
        }
        else {
            const preguntasObj = JSON.parse(data);
            const preguntasArray = preguntasObj.preguntas;
            console.log("llegue")
            if (idSelected >= 0 && idSelected < preguntasArray.length) {
                console.log("llegue")
                preguntasArray.splice(idSelected, 1);
                fs.writeFile(preguntasFichero, JSON.stringify(preguntasObj), (err) => {
                    if (err) {
                        console.log("No se pudo modificar el fichero");
                    } 
                    else {
                        res.json(preguntasObj);
                        console.log("llegue")
                    }
                })
            }
        }
    })
});