import { PrimaryColor, SecondaryColor } from "../../../common";
import {ReactComponent as Edit} from "./edit.svg";

export const DiscomTextItem = ({
    title,
    titleSpan,
    value,
    unit
}:  {
    title: string;
    titleSpan: string;
    value: number;
    unit: string;
}) => {
    return (
        <div className="discomTextItem">
            <div className="discomTextItem-title">
                {title} (<span 
                style={{
                   color: titleSpan === "Actual" ? PrimaryColor : SecondaryColor
                }}
                >{titleSpan}</span>)
            </div>
            <div className="discomTextItem-value">

                {value} {unit}

            </div>
        </div>
    );
};

export const DiscomTextItemEditable = ({
    title,
    titleSpan,
    value,
    unit,
    onChange
}:  {
    title: string;
    titleSpan: string;
    value: number;
    unit: string;
    onChange: (value: number) => void;
}) => {
    return (
        <div className="discomTextItem">
            <div className="discomTextItem-title">
                {title} (<span 
                style={{
                   color: titleSpan === "Actual" ? PrimaryColor : SecondaryColor
                }}
                >{titleSpan}</span>)
            </div>
            <div className="discomTextItem-value ">
                <form 
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const value = form.edited.value;
                        onChange(Number(value));
                    }
                }
                >
                <input name="edited" step="any" type="number" defaultValue={value} /></form> {unit} <span className="editIcon"><Edit /></span>

            </div>
        </div>
    );
};