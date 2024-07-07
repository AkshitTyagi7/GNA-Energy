
import React from 'react';
import {ReactComponent  as CrossIcon } from '../../../../icons/cross.svg';
interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}
export default function Popup({ isVisible, onClose, children, title }: PopupProps) {
    const popupStyle = {
        display: isVisible ? 'block' : 'none'
    };
    return (
        <div
        style={{ display: isVisible ? "flex" : "none" }}
        className="loading-container">
        <div className="chart-popup">
            <div className='flex mt-4 mr-4 ml-4 justify-between	' onClick={onClose}>
                <h2 className="text-lg ">{title}</h2>
                <CrossIcon width={20} height={20} /></div>
          {children}
          
        </div>
</div>    );
}