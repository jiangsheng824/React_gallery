import React, { Component } from 'react';
import './imgFigure.css';



class ImgFigure extends Component {
    constructor(props){
        super(props);
        this.state = {
            imgFigureClassName:"img-figure"
        }
    }
    componentDidMount(){
        // console.log(this.props.arrange.isInverse)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.arrange.isCenter){
            this.setState({
                imgFigureClassName: nextProps.arrange.isInverse ? "img-figure is-inverse" : "img-figure"
            })
        }
    }

    handelClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.arrange.isCenter){
            this.props.inverse();
            this.setState({
                imgFigureClassName: this.props.arrange.isInverse ? "img-figure is-inverse" : "img-figure"
            })
        }else{
            this.props.center();
        }
        
    }

    render() {
        return (
          <figure 
            className={this.state.imgFigureClassName}
            style={this.props.arrange.pos}
            onClick={this.handelClick.bind(this)}
          >
              <img src={this.props.image.imageUrl} alt={this.props.image.title}/>
              <figcaption>
                  <h2 className="img-title">{this.props.image.title}</h2>
                  <div className="img-back" onClick={this.handelClick.bind(this)}>
                    <p>{this.props.image.desc}</p>
                  </div>
              </figcaption>
          </figure>
        );
    }  
    
}
export default ImgFigure;