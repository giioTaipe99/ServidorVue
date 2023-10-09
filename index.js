var express = require("express");
var session = require("express-session");
/*"File System" (Sistema de Archivos),
este módulo proporciona funciones para interactuar con el sistema de archivos del sistema operativo, como leer y escribir archivos*/
var fs = require("fs");
/*CORS es un mecanismo de seguridad implementado en navegadores web que restringe las solicitudes 
HTTP realizadas desde un dominio diferente al dominio del recurso.*/
var cors = require("cors");
const { stringify } = require("querystring");
const { spawn } = require('child_process');
const { format } = require('date-fns');
const path = require('path');
const { dir } = require("console");
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
            res.json(preguntas);
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
            const preguntas = JSON.parse(data);

            preguntas.push(nuevaPregunta);

            fs.writeFile(preguntasFichero, JSON.stringify(preguntas, null, 2), (err) => {
                if (err) {
                    res.status(500).json({ Error: "No se pudo escribir en el fichero." })
                }
                else {
                    res.json(preguntas);
                }
            })
        }
    });

});

app.delete("/eliminar/:id", (req, res) => {
    const idSelected = parseInt(req.params.id);
    fs.readFile(preguntasFichero, 'UTF-8', (err, data) => {
        if (err) {
            console.log("No se pudo leer el fichero.");
        }
        else {
            const preguntas = JSON.parse(data);
            if (idSelected >= 0 && idSelected < preguntas.length) {
                preguntas.splice(idSelected, 1);
                fs.writeFile(preguntasFichero, JSON.stringify(preguntas, null, 2), (err) => {
                    if (err) {
                        console.log("No se pudo modificar el fichero");
                    }
                    else {
                        res.json(preguntas);

                    }
                })
            }
        }
    })
});

app.put("/editar/:id", (req, res) => {

    const preguntaObj = req.body;
    const id = req.params.id;

    fs.readFile(preguntasFichero, 'UTF-8', (err, data) => {
        if (err) {
            console.log("No se pudo leer el fichero.");
        }
        else {
            const preguntas = JSON.parse(data);
            preguntas[id] = preguntaObj;
            fs.writeFile(preguntasFichero, JSON.stringify(preguntas, null, 2), (err) => {
                if (err) {
                    console.log("No se pudo modificar el fichero");
                }
                else {
                    res.json(preguntas);

                }
            })
        }
    })
})
/*
Exercici 1: Codi que guarda la resposta contestada a cada pregunta en un fitxerPàgina
Exercici 2: Funció que escriu en fitxers diferents en cada execucióPàgina
Exercici 3: Crear un nou directori i comprovar si un directori o fitxer existeixPàgina
Exercici 4 Escriure en un fitxer JSONPàgina */
app.post("/almacenar", (req, res) => {
    const data = req.body;
    const subdirectorio = "Resultados";
    const directorio = path.join(__dirname, subdirectorio);
    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio);
    }
    const fechaHoraActual = new Date();
    const formatoFechaHora = format(fechaHoraActual, 'ddMMyyyy_HHmmss');
    const nombreArchivo = `respuestas_${formatoFechaHora}.txt`;
    const rutaArchivo = path.join(directorio, nombreArchivo);
    fs.writeFile(rutaArchivo, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log(err);
        } else {
            consoles.log("Se ha escrito en el fichero");
        }
    });

});

app.post("/prueba", (req, res) => {
    fs.readdir(__dirname, (err, data) => {
        var stringDir = data;
        console.log(stringDir)
        let dirResultados = "";
        stringDir.forEach(dir => {
            if (dir === "Resultados") {
                dirResultados = dir;
            }
        })
        fs.readdir(__dirname + "/" + dirResultados, (err, data) => {
            console.log(data);
        });

    });



});

app.post("/python", (req, res) => {

    const processoPython = spawn("python", ["index.py"]);

    // Manejar la salida del script Python
    processoPython.stdout.on("data", (data) => {
        console.log("Resultado del script");
        res.json({ result: data.toString() });
    });

    // Manejar errores del script Python
    processoPython.stderr.on("data", (error) => {
        console.log("Error en el srcipt");
        res.status(500).json({ error: "FALLO SRICPT" });
    });

    // Finalizar la ejecución del script Python
    processoPython.on("close", (code) => {
        console.log("PROCESO DE PYHTON FINALIZADO");
    });
});