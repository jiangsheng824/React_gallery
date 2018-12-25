import React, { Component } from 'react';
import './controller.css'


class ControllerItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            itemClassName:"controller-item"
        }
    }
    componentDidMount(){
        // console.log(this.props.arrange)
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.arrange.isCenter);
        if(nextProps.arrange.isCenter){
            this.setState({
                itemClassName: nextProps.arrange.isCenter ? "controller-item is-center" : "controller-item"
            })
            if(nextProps.arrange.isInverse){
                this.setState({
                    itemClassName: nextProps.arrange.isInverse ? "controller-item is-center isInverse" : "controller-item"
                })
            }
        }else{
            this.setState({
                itemClassName: nextProps.arrange.isCenter ? "controller-item is-center" : "controller-item"
            })
        }
    }
      
    handelClick(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
    }

    render(){
        return(
            <span 
            className={this.state.itemClassName}
            onClick={this.handelClick.bind(this)}
            >{this.props.num}</span>
        )
    }
}


export default ControllerItem;