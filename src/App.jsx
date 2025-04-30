import { useEffect, useRef, useState } from "react";
import read from "./readCsv";
import getCombinations from "./combinations";

export default function App() {
  const [url, setUrl] = useState(null);
  const [result, setResult] = useState([]);
  const [nums, setNums] = useState([]);
  const [combinations, setCombinations] = useState([])
  const [valueTicket, setValueTicket] = useState("")
  const [resultTicket, setResultTicket] = useState("")
  const [state, setState] = useState(0) // 0: inicio, 1: jugando

  const mapData = {
    1: ["/bingoPeliculas.png", "/songsPeliculas.csv", 0],
    2: ["/bingoActual.png", "/songsActual.csv", 0],
    3: ["/bingoAntiguo.png", "/songsAntiguo.csv", 0]
  }
  const [type, setType] = useState(1)
  const iframeRef = useRef(null);

  useEffect(() => {

  }, [url]);

  const rand = (result) => {
    if (nums.length >= result.length - 1) {
      return null;
    }

    const n = Math.floor(Math.random() * (result.length - 1)) + 1;
    if (nums.includes(n)) {
      return rand(result);
    }

    return n;
  };

  const next = async () => {
    if (state === 0) {
      const r = await read(mapData[type][1])
      setResult(r);
      const ids = r.slice(1).map(r => parseInt(r[0]))
      setCombinations(getCombinations(ids, 10))

      setState(1)

      const num = rand(r);
      nums.push(num);
      if (!num) {
        return;
      }
      setUrl(r[num][2]);

      return
    }

    const num = rand(result);
    nums.push(num);
    if (!num) {
      return;
    }
    setUrl(result[num][2]);
  };

  const check = () => {
    const valuesIncorrect = combinations[valueTicket].filter(value => !nums.includes(value))
    setResultTicket(valuesIncorrect.length > 0 ? valuesIncorrect : ["Ganador!"])
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {state === 1 && <div class="column1">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2>Cancion actual</h2>
          {url && (
            <iframe
              ref={iframeRef}
              width="560"
              height="315"
              src={url}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
          )}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "15px", marginBottom: "25px" }}>
            <button onClick={() => iframeRef.current.src = iframeRef.current.src}>Refrescar</button>
            <button onClick={next}>Siguiente</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input type="number" value={valueTicket} onChange={e => setValueTicket(e.target.value)}></input>
            <button onClick={check} style={{ marginLeft: "5px", marginRight: "5px"}}>Comprobar</button>
            <button onClick={() => setResultTicket("")}>Limpiar</button>
            <div>{resultTicket ? resultTicket.join("-") : ""}</div>
          </div>
        </div>
      </div>}
      {state === 1 && <div class="column2" style={{ width: "560px", marginLeft: "25px" }}>
        <h2>Lista juego</h2>
        <ul>
          {nums.map(n => <li>{n + "-" + result[n][1]}</li>)}
        </ul>
      </div>}
      {state === 0 && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "200px", justifyContent: "space-around" }}>
        <h1>BINGO MUSICAL</h1>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value={1}>Bingo Peliculas</option>
          <option value={2}>Bingo Actual</option>
          <option value={3}>Bingo Antiguo</option>
        </select>
        <button onClick={next}>Jugar</button>
        <link rel="Ticket" href="/ticket" />
      </div>}
    </div>
  );
}
