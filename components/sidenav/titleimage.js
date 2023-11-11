'use client'

import React from "react";
import PropTypes from 'prop-types'

export default class SideBarImage extends React.Component {

    sizes = {
        small: {cols: "grid-cols-[40px_auto]", class: "h-10 w-10"},
        large: {cols: "grid-cols-[80px_auto]", class: "h-20 w-20"},
    } 

    constructor(props) {
        super(props)
    }


  render() {
    return (

        <div id={this.props.id} className={"grid " + this.sizes[this.props.size].cols}>
            <div>
                <img
                    alt="name"
                    src={this.props.image}
                    className = {"object-cover rounded-full " + this.sizes[this.props.size].class}
                />
            </div>
            <div>
                <span className="pl-3 h-full flex flex-row items-center font-bold">{this.props.title}</span>
            </div>
        </div>

    );
  }
}

SideBarImage.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired
}

