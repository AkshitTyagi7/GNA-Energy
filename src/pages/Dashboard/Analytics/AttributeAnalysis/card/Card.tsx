import React from 'react';
import './Card.css';

interface TotalCardProps {
    totalAmount: string;
    totalText: string;
    isEditable?: boolean;
    onEdit?: (value: number) => void;
}

export default function TotalCard(props: TotalCardProps) {
    const { totalAmount, totalText, isEditable, onEdit } = props;
    const debounce = (func: any, delay: number) => {
        let debounceTimer: any;
        return function (this: any) {
            const context: any = this as any;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer =
            setTimeout(() => func.apply(context, args), delay);
        }
    }
    let handleChange = (event:any) => {
        event.persist();
        console.log("Something is changed in the textarea")
        console.log(event.target.value)
        if(event.target.value === "") {
            onEdit && onEdit(0);
            return;
        }
        onEdit && onEdit(Number(event.target.value));
    }
    
    let optimisedHandleChange = debounce(handleChange,1000);
    return (
        <div className="card card-total">
            <div className="card-body">
                {
                    isEditable ? <input 
                    
                    type="number"
                    className="card-input"
                    // value={totalAmount}
                    defaultValue={totalAmount}
                    // onChange={(e)=> {
                        
                    //     onEdit && onEdit(Number(e.target.value))}}
                    onChange={optimisedHandleChange}
                    
                    // onChangeCapture={(e) => onEdit && onEdit(Number(e.target.value))}
                    ></input>:<h2 className="card-title">{totalAmount}</h2>
                }

                {/* <h2 className="card-title">{totalAmount}</h2> */}

                
                <p className="card-text">{totalText}</p>
            </div>
        </div>
    );
}
