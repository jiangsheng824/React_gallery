import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from './imgFigure';
import ControllerItem from './controller';

import imageData from './data/images.json';
import './App.css';

//将图片名信息转成图片URL路径信息
var imageDatas = (function getImageUrl(imageDataArr){
  for(var i = 0;i<imageDataArr.length;i++){
    var singleImgData = imageDataArr[i];
    singleImgData.imageUrl = require("./images/"+singleImgData.filename);
    imageDataArr[i] = singleImgData;
  }
  return imageDataArr;
})(imageData);
// console.log(imageDatas);

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      imageDatas:imageDatas,
      constant:{
        center:{
          left:0,
          right:0,
          transform:"rotate(0)"
        },
        //水平方向的取值范围
        hPos:{
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        //垂直方向的取值范围
        vPos:{
          topSecY:[0,0],
          x:[0,0]
        }
      },
      imgArrangeArr:[]
    }
  }
  //组件加载后给每张图片计算位置范围
  componentDidMount(){
    //获取舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //获取一张图片的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgFigureW = imgFigureDOM.scrollWidth,
        imgFigureH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgFigureW / 2),
        halfImgH = Math.ceil(imgFigureH / 2);

    //给定位状态附上初始值
    this.setState({
      constant:{
        center:{
          left: halfStageW-halfImgW,
          top: halfStageH-halfImgH,
          // transform:"rotate(0deg)"
        },
        //水平方向的取值范围
        hPos:{
          leftSecX:[-halfImgW,halfStageW-halfImgW*3],
          rightSecX:[halfStageW+halfImgW,stageW-halfImgW],
          y:[-halfImgH,stageH-halfImgH]
        },
        //垂直方向的取值范围
        vPos:{
          topSecY:[-halfImgH,halfStageH-halfImgH*3],
          x:[halfStageW-imgFigureW,halfStageW]
        }
      }
    },()=>{
      // console.log(this.state.constant);
      this.rearrange(0);
    })
  }
  
  get30deg(){
    return ((Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random()*30));
  }

  //重新布局所有图片
  //@param centerIndex 中心图片
  rearrange(centerIndex){
    // console.log(this.state.imgArrangeArr);
    var imgArrangeArr = this.state.imgArrangeArr,
        constant = this.state.constant,
        centerPos = constant.center,
        hPos = constant.hPos,
        vPos = constant.vPos,
        hPosLeftSecX = hPos.leftSecX,
        hPosRightSecX = hPos.rightSecX,
        hY = hPos.y,
        vPosTopSecY = vPos.topSecY,
        vX = vPos.x;

    //中心区图片
    var imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);
        imgArrangeCenterArr[0]={
          pos:centerPos,
          isCenter:true
        };
        

    // 上侧图片
    var topImgNum = Math.floor(Math.random()*2),
        topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length-topImgNum)),
        imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgArrangeTopArr.forEach((value,index)=>{
          imgArrangeTopArr[index]={
            pos:{
              top:Math.ceil(Math.random()*(vPosTopSecY[1]-vPosTopSecY[0])+vPosTopSecY[0]),
              left:Math.ceil(Math.random()*(vX[1]-vX[0])+vX[0]),
              transform:"rotate("+this.get30deg()+"deg)"
            },
            isCenter:false
          }
        })

        //布局位于左右两侧的图片
        for(var i = 0;i < imgArrangeArr.length;i++){
          var k = imgArrangeArr.length / 2,
              hPosYorX = null;

          if(i<k){
            hPosYorX = hPosLeftSecX;
          }else{
            hPosYorX = hPosRightSecX;
          }

          imgArrangeArr[i]={
            pos:{
              top:Math.ceil(Math.random()*(hY[1]-hY[0])+hY[0]),
              left:Math.ceil(Math.random()*(hPosYorX[1]-hPosYorX[0])+hPosYorX[0]),
              transform:"rotate("+this.get30deg()+"deg)"
            },
            isCenter:false
          }
        }

        if(imgArrangeTopArr && imgArrangeTopArr[0]){
          imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
        }
        imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);
        this.setState({
          imgArrangeArr:imgArrangeArr
        })
      // console.log(this.state.imgArrangeArr);
  }

  //翻转图片
  inverse(index){
    return () =>{
      var imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState({
        imgArrangeArr:imgArrangeArr
      })
      // console.log(imgArrangeArr[index].isInverse);
    }
  }

  //居中图片
  center(index){
    return ()=>{
      this.rearrange(index);
    }
  }

  render() {
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {
            this.state.imageDatas.map((item,index)=>{
              if(!this.state.imgArrangeArr[index]){
                var arr = this.state.imgArrangeArr;
                arr[index]={
                  pos:{
                    left:0,
                    top:0,
                    transform:"rotate(0deg)"
                  },
                  isInverse:false,
                  isCenter:false
                }
              }
              return (
                <ImgFigure 
                key={index} 
                image={item} 
                ref={"imgFigure"+index}
                arrange={this.state.imgArrangeArr[index]}
                inverse={this.inverse(index)}
                center={this.center(index)}
                />
              )
            })
          }
        </section>
        <nav className="controller-nav">
          {
            this.state.imageDatas.map((item,index)=>{
              if(!this.state.imgArrangeArr[index]){
                var arr = this.state.imgArrangeArr;
                arr[index]={
                  pos:{
                    left:0,
                    top:0,
                    transform:"rotate(0deg)"
                  },
                  isInverse:false,
                  isCenter:false
                }
              }
              return (
                <ControllerItem 
                key={index}
                num={index+1}
                arrange={this.state.imgArrangeArr[index]}
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

export default App;
