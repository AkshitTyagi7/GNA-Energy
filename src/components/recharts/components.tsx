export const renderQuarterTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const { index, value, offset } = payload;
    const finalIndex = index + 1;
  
    // if (finalIndex  === 1 || finalIndex%97 ===0 ) {
    //   const pathX = Math.floor(x - offset) + 0.5;
    //   return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red"  width={"2px"}/>;
    // }
    if (finalIndex % 48 === 0 && finalIndex % 96 !== 0) {
      return (
        <text x={x} y={y - 4} fontSize={12} textAnchor="middle">
          {value}
        </text>
      );
    }
  };
  
  export const LegendItem = ({
    name,
    color,
    onClick,
    fontSize,
  }: {
    name: string;
    color: string;
    onClick?: () => void;
    fontSize?: string;
  }) => {
    return (
      <div className="realTime-Legend" onClick={onClick}>
        <p style={{ color: color }}>
          {" "}
          <div className="dot" style={{ backgroundColor: color }}></div> {name}
        </p>
      </div>
    );
  };
  
  export const MediumLegendItem = ({
    name,
    color,
    onClick,
    fontSize,
  }: {
    name: string;
    color: string;
    onClick?: () => void;
    fontSize?: string;
  }) => {
    return (
      <div className="realTime-Legend" onClick={onClick}>
        <p style={{ color: color, fontSize: "14p!important" }}>
          {" "}
          <div className="dot" style={{ backgroundColor: color }}></div> {name}
        </p>
      </div>
    );
  };
  

  export const YAxisFormatter = (number: number): string => {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(2) + 'Cr'; // Crore
    } else if (number >= 100000) {
      return (number / 100000).toFixed(0) + 'L'; // Lakh
    } else if (number >= 1000) {
      return (number / 1000).toFixed(0) + 'K'; // Thousand
    } else {
      return number.toString();
    }
  }
  