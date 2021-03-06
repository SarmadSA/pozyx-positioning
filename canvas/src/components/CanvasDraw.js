import React, {Component} from "react";

class CanvasDraw extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDrawing: true,
            lastX: 0,
            lastY: 0,
            hue: 1,
            direction: true,
            controlDisplay: "none",
            controlLeft: "100%",
            customColor: true,
            color: "#000000",
            customStroke: true,
            maxWidth: 100,
            minWidth: 5
        };
        this.draw = this.draw.bind(this);
        this.handleWidth = this.handleWidth.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    canvas() {
        return document.querySelector("#draw");
    }

    ctx() {
        return this.canvas().getContext("2d");
    }

    componentDidMount() {
        const canvas = this.canvas()
        const ctx = this.ctx()
        if (true) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        ctx.strokeStyle = "#BADA55";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = Number(this.state.minWidth) + 1;
        this.drawLoop();

    }

    drawLoop = () => {
        this.draw();
        window.requestAnimationFrame(this.drawLoop);
    }
    

    draw(e) {
        const ctx = this.ctx();
        const ctxL = this.canvas().getContext("2d");
        let acc = this.props.acc;
        let hue = this.state.hue;
        let X = Math.abs(this.props.cord.x);
        let Y = Math.abs(this.props.cord.y);
        //ROOM
       // let yCord = (Y - 1000)/(6500 - 1000) * (window.innerHeight);
       // let xCord = (X - 15500)/(5500 - 15500) * (window.innerWidth);
        //Table
        let xCord = (Y - 7900)/(9500 - 7900) * (window.innerWidth);
        let yCord = (X - 12200)/(11400 - 12200) * (window.innerHeight);
        
        ctxL.lineWidth = 20;
        this.setColor(acc);
        if (this.state.isDrawing) {
            if (this.state.color && this.state.customColor) {
                ctx.strokeStyle = this.state.color;
            } else {
                ctx.strokeStyle = `hsl(${this.state.hue}, 100%, 50%)`;
            }
           
                    
            ctx.beginPath();
            ctx.moveTo(this.state.lastX, this.state.lastY);
            ctx.lineTo(xCord, yCord);
            ctx.stroke();
            if (hue >= 360) {
                hue = 1
            }
            if (!this.state.customStroke) {
                this.handleWidth(e);
            }

            this.setState({
                hue: hue,
                lastX: xCord,
                lastY: yCord
            });

        }
    }

    setColor = (acceleration) => {
        if (acceleration < 1000) {
            //Set color to green
            this.setState({color: '#1BE600'});
        } else if (acceleration < 1500) {
            this.setState({color: '#BBFF00'});
        } else if (acceleration < 2000) {
            this.setState({color: '#F2DE00'});
        } else if (acceleration < 2500) {
            this.setState({color: '#EB9800'});
        } else if (acceleration < 3000) {
            this.setState({color: '#EB6200'});
        } else if(acceleration < 4000){
            this.setState({color: '#FF3300'});
        } else {
            this.setState({color: '#000000'});
        }
    };

    handleWidth(e) {
        const ctx = this.canvas().getContext("2d");
        let nextState = this.state.direction;
        if (ctx.lineWidth >= this.state.maxWidth && this.state.direction === true || ctx.lineWidth <= this.state.minWidth && this.state.direction === false) {
            nextState = !this.state.direction;
            this.setState({
                direction: nextState
            })
        }
        if (nextState) {
            ctx.lineWidth++;
        } else {
            ctx.lineWidth--;
        }
    }

    toggleControls() {
        let onScreen = this.state.controlLeft;
        let display = this.state.controlDisplay;
        const fade = () => {
            onScreen === "0%" ? (
                this.setState({controlLeft: "100%"})
            ) : (
                this.setState({controlLeft: "0%"})
            )
        }
        if ((display === "none" && onScreen === "100%") || (display === "block" && onScreen === "0%")) {
            if (display === "none") {
                this.setState({controlDisplay: "block"})
                setTimeout(() => fade(), 0)
            } else {
                fade()
                setTimeout(() => this.setState({controlDisplay: "none"}), 500)
            }
            ;
        }
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.type === "checkbox" ? target.checked : target.value
        const name = target.name

        this.setState({
            [name]: value
        })

        if (name === "minWidth" || name === "maxWidth") {
            this.ctx().lineWidth = Number(this.state.minWidth) + 1
            console.log(this.ctx().lineWidth)
        }
        if (name === "customStroke" && value === true) {
            this.ctx().lineWidth = this.state.minWidth
        } else if (name === "customStroke" && value === false) {
            this.ctx().lineWidth = Number(this.state.minWidth) + 1
        }
    }

    render() {

        const canvasStyle = {
            border: "1px solid black"
        }

        return (
            <div>
                <canvas id="draw" width={this.props.width} height={this.props.height}
                        style={canvasStyle}/>
                <Controls left={this.state.controlLeft} display={this.state.controlDisplay} canvas={this.canvas}
                          ctx={this.ctx} color={this.state.color} customColor={this.state.customColor}
                          handleInputChange={this.handleInputChange} maxWidth={this.state.maxWidth}
                          minWidth={this.state.minWidth}
                          fixedWidth={this.state.customStroke}/>
                <ButtonOptions onClick={this.toggleControls}/>
            </div>
        )
    }
}

function ButtonOptions(props) {
    const buttonStyle = {
        textAlign: "center",
        position: "absolute",
        right: "10px",
        top: "10px",
        cursor: "pointer",
        padding: "8px",
        color: "white",
        backgroundColor: "rgb(47, 47, 47)",
        border: "3px solid red",
        boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.47)"
    }
    return (
        <div onClick={props.onClick} style={buttonStyle}>
            <i className="fa fa-cogs" aria-hidden="true"></i>
        </div>
    )
}

function Controls(props) {
    const container = {
        position: "absolute",
        right: "70px",
        top: "0",
        backgroundColor: "transparent",
        width: "400px",
        height: "150px",
        overflow: "hidden",
        borderRadius: "0 0 5px 5px",
        display: `${props.display}`
    }
    const content = {
        backgroundColor: "rgb(47, 47, 47)",
        color: "white",
        boxSizing: "border-box",
        boxShadow: "rgba(0, 0, 0, 0.28) 0px 1px 2px 2px",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "10px",
        borderRadius: "0 0 5px 5px",
        position: "absolute",
        left: `${props.left || 0}`,
        transition: "0.5s cubic-bezier(0.22, 0.61, 0.36, 1)"
    }
    return (
        <div style={container}>
            <div style={content}>
                <StrokeCheckbox checked={props.customWidth} handleChange={props.handleInputChange}/>
                <StrokeWidth minWidth={props.minWidth} maxWidth={props.maxWidth}
                             fixedWidth={props.fixedWidth} handleChange={props.handleInputChange}/>
                <ColorCheckbox checked={props.customColor} handleChange={props.handleInputChange}/>
                {props.customColor &&
                <ColorPicker color={props.color} handleChange={props.handleInputChange}/>
                }
                <ClearCanvas ctx={props.ctx} canvas={props.canvas}/>
            </div>
        </div>
    )
}

function ClearCanvas(props) {
    const buttonStyle = {
        display: "block",
        float: "right",
        border: "1px solid #840000",
        backgroundColor: "#ff2929",
        cursor: "pointer"
    }
    const clear = () => {
        props.ctx().clearRect(0, 0, props.canvas().width, props.canvas().height)
    }
    return (
        <button style={buttonStyle} onClick={clear}>Clear Canvas</button>
    )
}

function ColorCheckbox(props) {
    return (
        <div>
            <label>
                <input name="customColor" type="checkbox" onChange={props.handleChange} value={props.checked}/>
                Custom Color
            </label>
        </div>
    )
}

function ColorPicker(props) {
    return (
        <input name="color" type="color" onChange={props.handleChange} value={props.color}/>
    )
}

function StrokeCheckbox(props) {
    return (
        <div>
            <label>
                <input name="customStroke" type="checkbox" onChange={props.handleChange} value={props.checked}/>
                Fixed Stroke Width
            </label>
        </div>
    )
}

function StrokeWidth(props) {
    const strokeControlStyle = {
        display: "flex",
        flexDirection: "row"
    }
    const inputStyle = {
        display: "block"
    }
    return (
        <div style={strokeControlStyle}>
            <label>
                {props.fixedWidth ? "Fixed" : "min"} Stroke Width
                <input style={inputStyle} name="minWidth" type="range"
                       onChange={props.handleChange} value={props.minWidth}
                       min="1" max="150" step="1"
                />
            </label>
            {!props.fixedWidth && (
                <label>
                    max Stroke Width
                    <input style={inputStyle} name="maxWidth" type="range"
                           onChange={props.handleChange} value={props.maxWidth}
                           min="1" max="150" step="1"
                    />
                </label>
            )}
        </div>
    )
}

export default CanvasDraw;
