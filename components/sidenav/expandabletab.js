'use client'

import React from "react";
import PropTypes from 'prop-types'
import SideBarImage from "./titleimage"


export default class ExpandableTab extends React.Component {

    constructor(props) {
        super(props)

        const coops = [
            {id: "coop-1", name: "Hen House", image: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0"},
            {id: "coop-2", name: "Rooster House", image: "https://thehenhousecollection.b-cdn.net/wp-content/uploads/fly-images/1942/pictures-of-chicken-coops-3x3-scaled-768x9999.jpg"}
        ]

        this.state = {
            collapsed: true,
            selected: coops[0],
            coops: coops
        }

        this.collapsed = this.collapsed.bind(this);
        this.select = this.select.bind(this)
    }
    
    collapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    
    select(coop) {
        this.setState({
            selected: coop,
            collapsed: true
        }) 
    }


  render() {
    return (

        <div className="">
            <button type="button" className="p-2 flex items-center w-full text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={this.collapsed}>
                <span className="flex-1 text-left whitespace-nowrap ml-3 ">
                        <SideBarImage id={this.state.selected.id + "_selected"} title={this.state.selected.name} image={this.state.selected.image} size="large"/>
                </span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
            
           <ul className={( this.state.collapsed ? " hidden " : "")}> 
           
                {this.state.coops.filter(coop => coop.id != this.state.selected.id).map(coop => {
                    return <li key={coop.id} className="">
                                <a className="p-2 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer" onClick={() => this.select(coop)}>
                                    <span className="ml-3">
                                        <SideBarImage id={coop.id} title={coop.name} image={coop.image} size="small"/>
                                    </span>
                                </a>
                            </li>
                })}
           
            </ul>
        </div>

    );
  }
}