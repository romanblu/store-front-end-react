import React, {useState} from 'react'
import './Dropdown.scss'

export default function Dropdown(props) {
    const [value, setValue] = useState("");
    const optionsSelect = props.labels.map(label => (

        <option value={label.data} id={label.id}>{label.title}</option>
    ));

    function handleChange(e){
        setValue(e.target.value);
        const labelId = e.target.options[e.target.selectedIndex].id ;
        props.onChange(e.target.id, e.target.value, labelId);
    }

    return (
        
        <div>
            <select onChange={handleChange} id={props.id} value={value} className="ui dropdown fluid"  >
                <option value="">{props.title}</option>
                {optionsSelect}
            </select>
        
        </div>
            
    )
}
