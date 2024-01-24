import React from 'react';
import './Card.css';
import {ReactComponent as Pencil} from '../../../../icons/pencil.svg'
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

        if(event.target.value === "") {
            onEdit && onEdit(0);
            return;
        }
        onEdit && onEdit(Number(event.target.value));
    }
    
    let optimisedHandleChange = debounce(handleChange,1000);
    return (
        <div>
             <p className="card-text text-center">{totalText}</p>
       
        <div className="card card-total">
           
            <div className="card-body">
                {
                    isEditable ? 
                    
                    <div className='flex flex-row justify-between'>
                    <input 
                    id="totalAmount"
                    type="number"
                    className="card-input"
                    // value={totalAmount}
                    defaultValue={totalAmount}
                    // onChange={(e)=> {
                        
                    //     onEdit && onEdit(Number(e.target.value))}}
                    onChange={optimisedHandleChange}
                    
                    // onChangeCapture={(e) => onEdit && onEdit(Number(e.target.value))}
                    ></input>
                    <Pencil className='' width={'20px'} height={'20px'} color='white' fill='white' onClick={()=>{
                        let input = document.getElementById("totalAmount");
                        input && input.focus();

                    }}/>
                    </div>:<h2 className="card-title">{totalAmount}</h2>
                }

                {/* <h2 className="card-title">{totalAmount}</h2> */}

                
                </div>
            </div>
        </div>
    );
}
