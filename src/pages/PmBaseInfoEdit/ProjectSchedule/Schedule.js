import React, { Component } from 'react';
import cls from 'classnames';
import styles from './index.less';

function rect(ctx, props) {
    const {
        Lines,
        lineMode,
        direction,
        color
    } = props;
    ctx.beginPath();
    ctx.lineWidth = 2;
    var frX = 0;
    var frY = 0;
    var toX = 0;
    var toY = 0;
    if (Lines && Lines.length > 0) {
        if (Lines.length == 1) {
            var line = Lines[0]
            frX = parseFloat(line.frX);
            frY = parseFloat(line.frY);
            toX = parseFloat(line.toX);
            toY = parseFloat(line.toY);
            //画直线
            ctx.moveTo(frX, frY);
            ctx.lineTo(toX, toY);
        } else {
            for (var i = 0, ilen = Lines.length; i < ilen; i++) {
                var line = Lines[i]
                toX = parseFloat(line.toX);
                toY = parseFloat(line.toY);
                if (i == 0) {
                    frX = parseFloat(line.frX);
                    frY = parseFloat(line.frY);
                    ctx.moveTo(frX, frY);
                    ctx.lineTo(toX, toY);
                } else {
                    ctx.lineTo(toX, toY);
                }
            }
        }
    }

    if (lineMode != 'OnlyLine') {
        var upX = 0;
        var upY = 0;
        var downX = 0;
        var downY = 0;
        if (direction == "Horizontal") {
            upX = toX - 7;
            upY = toY - 7;
            downX = toX - 7;
            downY = toY + 7;
        } else if (direction == "Vertical") {
            upX = toX - 7;
            upY = toY - 7;
            downX = toX + 7;
            downY = toY - 7;
        }

        //画上边箭头线
        ctx.moveTo(upX, upY);
        ctx.lineTo(toX, toY);
        //画下边箭头线
        ctx.lineTo(downX, downY);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
}

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.canvasParams = {
            Lines: JSON.parse(this.props.Lines),
            width: parseFloat(this.props.width),
            height: parseFloat(this.props.height),
            lineMode: this.props.lineMode,
            direction: this.props.direction,
            color: this.props.color,
            clsName: this.props.clsName
        };
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    updateCanvas() {
        try {
            var canvas = document.getElementById(this.canvasParams.clsName);
            if (!canvas) {
                console.log('Canvas not found.');
            } else {
                if (!canvas.getContext) {
                    console.log('Context not supported.');
                } else {
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.log('Context 2D not available.');
                    } else {
                        rect(ctx, this.canvasParams);
                    }
                }
            }
        } catch (exc) {
            console.log(exc);
        }
    }

    render() {
        return (
            <canvas
                id={this.canvasParams.clsName}
                ref="canvas"
                width={this.canvasParams.width}
                height={this.canvasParams.height}
                className={cls(styles[this.canvasParams.clsName])} />
        )
    }
}

export default Schedule;