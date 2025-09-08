import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {

  const [rate, setRate] = useState(10); // how fast we go
  const [start, setStart] = useState(0);
  const [total_time, setTotal] = useState(1);

  const fetched = useRef(false);

  const [prog, setprog] = useState(0);
  const [x, setx] = useState(0);
  const [y, sety] = useState(0);


  const [timeline, setTimeline] = useState<any[]>([]); // list of all rows given for location
  const [index, setIndex] = useState(0); // current index in timeline

  const [maxX, setMaxX] = useState<number>(-Infinity);
  const [minX, setMinX] = useState<number>(Infinity);
  const [maxY, setMaxY] = useState<number>(-Infinity);
  const [minY, setMinY] = useState<number>(Infinity);

  // useEffect(() => {
  //   fetch("https://api.openf1.org/v1/sessions?session_key=9161")
  //     .then((res) => res.json())
  //     .then((jsonContent) => {
  //       const data = jsonContent[0];
  //     });
  // }, []);

  function advanceTen(e: KeyboardEvent) {
    if (e.key === "a") {
      console.log('advancing');
      // setTime(prev => prev + totalTime / 10);
      setIndex(prev => Math.min(prev + Math.floor(timeline.length / 100),timeline.length - 1));
    }
  }
  function dropTen(e: KeyboardEvent) {
    if (e.key === "b") {
      // setTime(prev => prev + totalTime / 10);
      setIndex(prev => Math.max(prev - Math.floor(timeline.length / 100),0));
    }
  }
  useEffect(() => {
    if (fetched.current) return;
    fetch("https://api.openf1.org/v1/location?session_key=9161&driver_number=1")
      .then((res) => res.json())
      .then((rows) => {
        setTimeline(rows);

        const total_t = new Date(rows[rows.length - 1].date).getTime() -
                        new Date(rows[0].date).getTime();
        setTotal(total_t);
        setStart(new Date(rows[0].date).getTime());

        const xs = rows.map((r: { x: any; }) => r.x);
        const ys = rows.map((r: { y: any; }) => r.y);

        setMaxX(Math.max(...xs));
        setMinX(Math.min(...xs));
        setMaxY(Math.max(...ys));
        setMinY(Math.min(...ys));

        console.log(Math.max(...xs));
        console.log(Math.min(...xs));
        console.log(Math.max(...ys));
        console.log(Math.min(...ys));
        fetched.current = true;
      });

  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "a") {
        advanceTen(e);
      } else if (e.key ==="b") {
        dropTen(e);
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [timeline]);




  useEffect(() => { // advance time
    if (fetched.current === false) return;

    const id = setInterval(() => {
      setIndex((prev) => {
        const next = Math.min(prev + 1, timeline.length - 1);
        const sample = timeline[next];
        // console.log(sample);
        const time_in_race = new Date(sample.date).getTime() - start;
        // console.log(time_in_race);
        const elapsed = new Date(sample.date).getTime() - start;
        setprog((elapsed / total_time) * 100);
        // console.log(sample);

        // console.log("Using server’s timestamp:", sample.x);
        setx(sample.x);
        sety(sample.y);
        console.log(sample.x);
        // Use sample.x, sample.y, etc.

        return next;
      });
    }, 1000 / rate);

    return () => clearInterval(id);
  }, [timeline]);


  const normX = ((x - minX) / (maxX - minX)) * 100;
  const normY = ((y - minY) / (maxY - minY)) * 100;

  return (
    <main className="container">
      <div className="map">

        <div className="ver" style ={{left: `${normX}%`, position:'absolute', bottom: `${normY}%`}}>VER</div>

      </div>

      <div className="timeline">
        <div
          className="time-marker"
          style={{ left: `${prog}%`, position: 'absolute' }}
        >
          |
        </div>
      </div>
    </main>
  );
}

export default App;
