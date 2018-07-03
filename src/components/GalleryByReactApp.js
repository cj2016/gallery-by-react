require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

let imageDatas = require('../data/imageData.json');

class GalleryByReactApp extends React.Component {
	constructor(props) {
		super(props);
		// Don't call this.setState() here!

		this.getImageUrl = this.getImageUrl.bind(this);
	}

	getImageUrl() {
		imageDatas.map(item => {
			item.imageURL = require(`../images/${item.fileName}`);
			return item;
		})
	}

	render() {
		return (
			<section className='stage'>
				<section className="img-sec"></section>
				<nav className="controller-nav"></nav>
			</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;