const Connection = require("./BaseDatos");

function VaciarTemp() {
    Connection.execute("DROP TABLE IF EXISTS temporal");
}
//  POSIBLE ERROR DE CALLBACK!!! 
//  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
function ExiteAlumno(IDTarjeta) {
    Connection.execute("SELECT * FROM alumno WHERE tarjetaId = ?", [IDTarjeta], (err, rows) => {
        if(rows.length === 0){
            console.log("Alumno no existente");
            return;
        }else{
            const HoraLlegada = new Date();
            Connection.execute("CREATE TABLE temporal(Id_Temp INT AUTO_INCREMENT PRIMARY KEY, HorarioTemp TIME)")
            Connection.execute("INSERT INTO temporal(HorarioTemp) VALUE (?)", [HoraLlegada]);
            Connection.execute("SELECT IF(TIMEDIFF(?, h.hora) > `00:15:00`, `Tarde`, `Temprano`)`Estado` FROM  horario h, alumno a WHERE tarjetaId = ? AND a.FK_Curso = h.FK_Curso", [HoraLlegada], [IDTarjeta], (err, rows) => {
                console.log(rows);
            });
            VaciarTemp();
        }
    });
}

function HorarioCorrecto(IDTarjeta){
    Connection.execute("SELECT a.PK_dni `DNI`, a.nombre `Nombre`, a.apellido `Apellido`, c.PK_id `Curso`, h.hora `HorarioIngreso` FROM alumno a INNER JOIN curso c ON a.FK_Curso = c.PK_id INNER JOIN horario h ON c.PK_id = h.FK_Curso WHERE a.tarjetaId = ?", [IDTarjeta], (err, rows) => {
        console.log(rows);
    });
}



module.exports = {ExiteAlumno, HorarioCorrecto};
