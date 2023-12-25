import React, {useState, useEffect} from "react";

export default function CoopList(props) {

    return (
        <div>
            {
                props.coops.map(coop => (
                    <div key={coop.id}>
                        {coop.name} {coop.id}
                    </div>
                ))
            }
        </div>
    )

}