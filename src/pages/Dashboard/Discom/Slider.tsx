import React, { useState } from 'react';

const Slider = ({currentValue, maxValue, minValue, onChange } : {
    currentValue: number,
    maxValue: number,
    minValue: number,
    onChange: (value: number) => void

}) => {
    const [value, setValue] = useState(currentValue || 0);

    const handleSliderChange = (event : any) => {
        setValue(event.target.value);
    };

    const handleSliderRelease = () => {
        onChange(value);
    };

    return (
        <div>
            <p>{value}</p>
            <input
            className='slider2'
                type="range"
                min={minValue || 0}
                max={maxValue || 10}
                step={0.1}
                value={value}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
            />
        </div>
    );
};

export default Slider;
