const pool = require("../config/database");

async function getTabla(grupo) {

    const [rows] = await pool.query(

`
SELECT

nombre AS seleccion,

SUM(PJ) PJ,

SUM(PG) PG,

SUM(PE) PE,

SUM(PP) PP,

SUM(GF) GF,

SUM(GC) GC,

SUM(GF)-SUM(GC) DG,

SUM(PTS) PTS

FROM

(

SELECT

s.nombre,

1 PJ,

CASE

WHEN p.goles_local>p.goles_visitante THEN 1

ELSE 0

END PG,

CASE

WHEN p.goles_local=p.goles_visitante THEN 1

ELSE 0

END PE,

CASE

WHEN p.goles_local<p.goles_visitante THEN 1

ELSE 0

END PP,

p.goles_local GF,

p.goles_visitante GC,

CASE

WHEN p.goles_local>p.goles_visitante THEN 3

WHEN p.goles_local=p.goles_visitante THEN 1

ELSE 0

END PTS

FROM partidos p

INNER JOIN selecciones s

ON s.id=p.seleccion_local_id

WHERE

s.grupo=?

AND p.estado='FINALIZADO'
AND p.fase='GRUPOS'

UNION ALL

SELECT

s.nombre,

1,

CASE

WHEN p.goles_visitante>p.goles_local THEN 1

ELSE 0

END,

CASE

WHEN p.goles_visitante=p.goles_local THEN 1

ELSE 0

END,

CASE

WHEN p.goles_visitante<p.goles_local THEN 1

ELSE 0

END,

p.goles_visitante,

p.goles_local,

CASE

WHEN p.goles_visitante>p.goles_local THEN 3

WHEN p.goles_visitante=p.goles_local THEN 1

ELSE 0

END

FROM partidos p

INNER JOIN selecciones s

ON s.id=p.seleccion_visitante_id

WHERE

s.grupo=?

AND p.estado='FINALIZADO'
AND p.fase='GRUPOS'

)x

GROUP BY nombre

ORDER BY

PTS DESC,

DG DESC,

GF DESC

`,
[
grupo,

grupo

]

);

return rows;

}

module.exports={
getTabla
};