require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageData.json');


imageDatas = (() => {
	imageDatas.forEach(item => {
		item.imageURL = require(`../images/${item.fileName}`);
	});

	return imageDatas
})();

/*
 *获取区间内的一个随机值
 */
const getRangeRandom = (low, high) => {
	return Math.ceil(Math.random() * (high - low) + low);
}
/*
 *获取0-30°之间的一个任意正负值
 */
const get30DegRandom = () => {
	return Math.random() > 0.5 ? Math.ceil(Math.random() * 30) : '-' + Math.ceil(Math.random() * 30);
}


class ImgFigure extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}
	/*
		ImgFigure的点击处理函数
	*/
	handleClick(e) {

		//如果居中，则翻转
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		let {
			title,
			desc,
			imageURL,
		} = this.props.data;
		//如果props属性中指定了这张图片的位置，则使用
		let styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos
		}
		//如果图片的旋转角度有值并且不为0，添加旋转角度
		if (this.props.arrange.rotate) {
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(item => {
				styleObj[item] = `rotate(${this.props.arrange.rotate}deg)`;
			});
		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = '111'
		}

		let imgFigureClassName = `img-figure ${this.props.arrange.isInverse?'is-inverse':''}`;

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}> 
				<img 
					src={imageURL} 
					alt={title} 
				/>
				<figcaption>
					<h2 className='img-title'>{title}</h2>
					<div className='img-back'>
						<p>{desc}</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

//控制组件
class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {

		//如果点击的是当前正在选中态的按钮，则翻转图片,否则将对应的图片居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		let {
			arrange: {
				isCenter,
				isInverse
			}
		} = this.props;
		let controllerUnitClass = `controller-unit ${isCenter?'is-center':''} ${isInverse?'is-inverse':''}`;
		return (
			<span className={controllerUnitClass} onClick={this.handleClick}></span>
		);
	}
}

class GalleryByReactApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Constant: {
				centerPos: {
					left: 0,
					top: 0
				},
				hPosRange: { //水平方向的取值范围
					leftSecX: [0, 0],
					rightSecX: [0, 0],
					y: [0, 0]
				},
				vPosRange: {
					topY: [0, 0],
					x: [0, 0]
				}
			},
			imgsArrangeArr: [
				/*{
					pos:{
						left:'0',
						top:'0'
					},
					rotate:0, //旋转角度
					isInverse:false, //图片正反面
					isCenter:false //图片是否居中
				}*/
			]
		}
	}
	/*
	 * 翻转图片
	 * @param index 输入当前被执行的inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	inverse(index) {
		return () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr
			})
		}
	}

	/*
	 * 利用 rearrange函数，居中对应index的图片
	 * @param index 需要被居中的图片对应信息数组的
	 * @return {Function} 
	 */

	center(index) {
		return () => {
			this.rearrange(index);
		}
	}


	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定居中排布那个图片
	 */
	rearrange(centerIndex) {
		let {
			imgsArrangeArr,
			Constant: {
				centerPos,
				hPosRange,
				vPosRange
			}
		} = this.state;

		let hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y;

		let vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x;

		// debugger

		let imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		//首先居中 centerIndex 的图片
		// imgsArrangeCenterArr[0].pos = centerPos;
		//居中的centerIndex的图片不需要旋转
		// imgsArrangeCenterArr[0].rotate = 0;

		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局位于上侧的图片

		imgsArrangeTopArr.forEach(item => {
			item = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		})

		//布局左右两侧的图片
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;
			//前半部分布局左边，右半部分布局右边
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}


		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

		this.setState({
			imgsArrangeArr
		})
	}

	//组件加载后，为每张图片计算其位置的范围
	componentDidMount() {

		//首先拿到舞台的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
		let stageW = stageDOM.scrollWidth;
		let stageH = stageDOM.scrollHeight;
		let halfStageW = Math.ceil(stageW / 2);
		let halfStageH = Math.ceil(stageH / 2);

		//拿到imgFigure的大小
		let imgFigureDOm = ReactDOM.findDOMNode(this.refs.imgFigure0);
		let imgW = imgFigureDOm.scrollWidth;
		let imgH = imgFigureDOm.scrollHeight;
		let halfImgW = Math.ceil(imgW / 2);
		let halfImgH = Math.ceil(imgH / 2);

		//计算中心图片的位置点
		let Constant = this.state.Constant;
		Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		//计算左侧，右侧区域图片排布位置的取值范围
		Constant.hPosRange.leftSecX[0] = -halfImgH;
		Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		Constant.hPosRange.y[0] = -halfImgH;
		Constant.hPosRange.y[1] = stageH - halfImgH;

		//计算上侧区域图片排布位置的取值范围
		Constant.vPosRange.topY[0] = -halfImgH;
		Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		Constant.vPosRange.x[0] = halfStageW - imgW;
		Constant.vPosRange.x[1] = halfStageW;

		this.setState({
			Constant
		})

		this.rearrange(0);
	}

	render() {
		return (
			<section className='stage' ref='stage'>
				<section className='img-sec'>
					{
						imageDatas.map((item,index)=>{
							if (!this.state.imgsArrangeArr[index]) {
								this.state.imgsArrangeArr[index]={
									pos:{
										left:'0',
										top:'0'
									},
									rotate:0,
									isInverse:false,
									isCenter:false
								}
							}
							return(
								<ImgFigure 
									data={item} 
									ref={'imgFigure'+index} 
									key={index}
									arrange={this.state.imgsArrangeArr[index]}
									inverse={this.inverse(index)}
									center={this.center(index)}
								/>
							)
						})
					}
				</section>
				<nav className='controller-nav'>
					{
						imageDatas.map((item,index)=>{
							return(
								<ControllerUnit 
									key={index} 
									arrange={this.state.imgsArrangeArr[index]}
									inverse={this.inverse(index)}
									center={this.center(index)}
								/>
							)
						})
					}
				</nav>
			</section>
		);
	}
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;