import React from "react";
import Context from '../context'


function SelectControl() {

    const [value, setValue] = React.useState('');
    const { setOrder } = React.useContext(Context);

    function changeSelect(event) {
        setValue(event.target.value);
        setOrder(event.target.value);
    }

    return (
        <div>
            <select value={value} className="form-select" onChange={changeSelect}>
                <option value="status">status</option>
                <option value="title">title</option>
                <option value="date">date</option>
            </select>
        </div>
    )
}


export default SelectControl;