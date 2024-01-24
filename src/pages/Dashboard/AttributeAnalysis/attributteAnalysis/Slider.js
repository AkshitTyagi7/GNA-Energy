import React, { useState } from 'react';

const Slider = ({currentValue, maxValue, minValue, onChange }) => {
    const [value, setValue] = useState(currentValue || 0);

    const handleSliderChange = (event) => {
        setValue(event.target.value);
    };

    const handleSliderRelease = () => {
        onChange(value);
    };

    return (
        <div>
            <p>{value}</p>
            <input
            className='slider'
                type="range"
                min={minValue || 0}
                max={maxValue || 0}
                step={0.1}
                value={value}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
            />
        </div>
    );
};

export default Slider;
