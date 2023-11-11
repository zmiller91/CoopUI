'use client'

import React from "react";
import Link from 'next/link'
import PropTypes from 'prop-types'

export default class SideBarTab extends React.Component {

    constructor(props) {
        super(props)   
    }


  render() {
    return (

        <Link href={this.props.location} 
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span className={!this.props.nested ? "ml-3": "ml-11"}>{this.props.title}</span>
        </Link>

    );
  }
}


SideBarTab.propTypes = {
    location: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    nested: PropTypes.bool
}

SideBarTab.defaultProps = {
    nested: false
}