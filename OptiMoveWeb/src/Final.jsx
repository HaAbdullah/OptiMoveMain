import React, { useState, useEffect } from "react";
import "./Styling/Final.css";
import i1 from "./img/input.png";

//TODO:
// Add - for empty tiles for the image tiles instead of "W" and "B"
// Add CSS animations: the image flip to cropped version
// Refactor everything: remove unnecessary files and only keep data set where it is needed
// add venv to gitingore
// Make it dynamic for mobiles lol
// clean up any unnecessary print statements in both flask server and console
// Add to docker
// Make a yt video for this project detailing installation
// For the attach image: put the plus behind the spline and the other on top as it is rn
// Apply css changes to the OptiMoveDemo

console.log("Rerendered");
const Final = ({
  Turn,
  POV,
  sceneChanger,
  FEN,
  letters,
  setLetters,
  setFEN,
}) => {
  // BOARD IMAGE

  // IMAGE TILES
  const [tiles, settiles] = useState({});
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const rowOrder = POV === "white" ? rows : [...rows].reverse();
  const colOrder = POV === "white" ? columns : [...columns].reverse();

  // Here is my work around to import mass images in scale, unsure if this is the industry standard but it works really well
  // wait for each of the images to be properly loaded into the variable "loadImages" (dictionary) that variable is then used as the images.

  const [move, setMove] = useState("");
  useEffect(() => {
    const makeRequests = async () => {
      try {
        // First request to /api/tiles
        const formData1 = new FormData();
        formData1.append("usrPOV", POV);
        const response1 = await fetch("http://127.0.0.1:5000/api/tiles", {
          method: "POST",
          body: formData1,
        });
        const data1 = await response1.json();
        console.log(data1.letters);
        setLetters(data1.letters);

        // Second request to /api/fen
        const formData2 = new FormData();
        formData2.append("usrTurn", Turn);
        const response2 = await fetch("http://127.0.0.1:5000/api/fen", {
          method: "POST",
          body: formData2,
        });
        const data2 = await response2.json();
        console.log(data2.fen);
        setFEN(data2.fen);
        console.log("FEN set:", data2.fen);

        // Third request to /api/move (GET request)
        const response3 = await fetch("http://127.0.0.1:5000/api/move");
        const data3 = await response3.json();
        console.log(data3.move);
        if (data3.move) {
          console.log(data3.move);
          setMove(data3.move.toUpperCase());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    makeRequests();
  }, []);

  useEffect(() => {
    const loadtiles = async () => {
      const loadedtiles = {};
      for (let row of rows) {
        for (let col of columns) {
          const imgKey = `${col}-${row}`;
          loadedtiles[imgKey] = await import(
            `../../BoardDivider/output_tiles/${col}-${row}.png`
          );
          // console.log(loadedtiles[imgKey]);
        }
      }
      settiles(loadedtiles);
    };

    loadtiles();
  }, [Turn, POV]);

  // Need to flatten the result because you want one array, not nested array
  const tileDivs = rowOrder.flatMap((row) =>
    colOrder.map((col) => {
      const tileName = `${col}${row}`;
      const tileSrc = tiles[`${col}-${row}`]?.default; // Access the default export. "`${col}-${row}`" is the key sent in the UseEffect
      //This is needed because import() returns an object and this is the way to get the actual image inside.
      // the "? is seperate meaning "wait for it to render"
      // console.log(tileSrc);
      return (
        <div key={tileName} className="tile">
          {/* this is where the "?" is used  */}
          {tileSrc ? (
            <img className="tile-img" src={tileSrc} alt={tileName} />
          ) : (
            <div className="loading">...</div>
          )}
        </div>
      );
    })
  );

  // Array of letters
  const pieceDivs = letters.map((tileLetter, index) => {
    return (
      <div key={index} className="tile-letter">
        {tileLetter}
      </div>
    );
  });

  return (
    <div className="Final">
      <div className="diagram-row">
        <div className="board-container">
          <img className="board-img" src={i1}></img>
        </div>
        <div className="transition-arrow">
          <div className="arrow">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="board-tiles">
          <div className="tiles-container">{tileDivs}</div>
        </div>
        <div className="transition-arrow">
          <div className="arrow">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="letter-tiles-container">
          <div className="letter-tiles">{pieceDivs}</div>
        </div>
      </div>
      <div className="result-container">
        <div
          className="FEN"
          onClick={() => {
            navigator.clipboard.writeText(FEN);
          }}
        >
          {FEN || "..."}
        </div>
        <div className="Move">{move || "..."}</div>
        <div className="Reset" onClick={() => sceneChanger("Opening")}>
          {/* Unsure why atm but when i place this svg as a file it messes up its border and details, will figure out once functionality is complete */}
          {/* prettier-ignore */}
          <svg className="reset-img" version="1.1" viewBox="0.0 0.0 159.28083989501312 152.7270341207349" fill="none" stroke="none" strokeLinecap="square" strokeMiterlimit="10" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l159.28084 0l0 152.72704l-159.28084 0l0 -152.72704z" clipRule="nonzero"/></clipPath><g clipPath="url(#p.0)"><path fill="#000000" fillOpacity="0.0" d="m0 0l159.28084 0l0 152.72704l-159.28084 0z" fillRule="evenodd"/><path fill="#0f1a20" d="m0 0l156.37796 0l0 150.4252l-156.37796 0z" fillRule="evenodd"/><path stroke="#4045c9" strokeWidth="10.0" strokeLinejoin="round" strokeLinecap="butt" d="m0 0l156.37796 0l0 150.4252l-156.37796 0z" fillRule="evenodd"/><path fill="#ff4d94" d="m33.57192 130.84026l97.76378 0l0 -20.188972l-97.76378 0z" fillRule="evenodd"/><path stroke="#ff4d94" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m33.57192 130.84026l97.76378 0l0 -20.188972l-97.76378 0z" fillRule="evenodd"/><path fill="#ff4d94" d="m33.573566 39.79621l97.79343 0l0 -20.210997l-97.79343 0z" fillRule="evenodd"/><path stroke="#ff4d94" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m33.573566 39.79621l97.79343 0l0 -20.210997l-97.79343 0z" fillRule="evenodd"/><path fill="#ff4d94" d="m131.3676 130.85039l0 -111.273605l-20.832443 0l0 111.273605z" fillRule="evenodd"/><path stroke="#ff4d94" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m131.3676 130.85039l0 -111.273605l-20.832443 0l0 111.273605z" fillRule="evenodd"/><path fill="#ff4d94" d="m52.95009 130.85039l0 -60.482162l-22.796642 0l0 60.482162z" fillRule="evenodd"/><path stroke="#ff4d94" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m52.95009 130.85039l0 -60.482162l-22.796642 0l0 60.482162z" fillRule="evenodd"/><path fill="#ff4d94" d="m13.233487 84.85541l28.317242 -31.410004l28.317238 31.410004z" fillRule="evenodd"/><path stroke="#ff4d94" strokeWidth="1.0" strokeLinejoin="round" strokeLinecap="butt" d="m13.233487 84.85541l28.317242 -31.410004l28.317238 31.410004z" fillRule="evenodd"/></g></svg>
        </div>
      </div>
      {/* <div className='line-container'></div> */}
    </div>
  );
};

export default Final;

//enjoy: https://youtube.com/shorts/opABLRcCDzw?si=O56_HsVFAOdZclz0
