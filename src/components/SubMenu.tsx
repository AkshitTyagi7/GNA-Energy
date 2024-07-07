import { SecondaryColor } from "../common";

export interface IdTitle{
    id: string | number,
    title: string
}
export function SubMenu({ item, onSelected, isSelected }: {item: IdTitle,onSelected:Function,isSelected:boolean })  {


                    return <div
                        onClick={async () => {
                            onSelected(item);
                            // selectedSubFilter===item.id;
                       
                        }
                        }
                        className="flex justify-between subfilterItem" style={{ "background": isSelected ? SecondaryColor : "#cccccd" }}>
                        <span style={{
                            color: isSelected ? "white" : "black"
                        }}>{item.title}</span>
                    </div>



    
}