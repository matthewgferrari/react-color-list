import React, { useState, useRef } from "react"
import Picker from "./picker/Chrome"
import PropTypes from "prop-types"
import Popover from "@material-ui/core/Popover"
import Button from "@material-ui/core/Button"
import Animate from "react-pose"
import { motion } from "framer-motion"
import arrayMove from "array-move"
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import IconButton from "@material-ui/core/IconButton"
import "./index.css"
import colorConvert from "color-convert"

const Shake = Animate.div({
    shake: {
        applyAtEnd: { x: 0 },
        applyAtStart: { x: -6 },
        x: 0,
        transition: {
            type: "spring",
            stiffness: 2000,
            damping: 10,
            duration: 2
        }
    }
});


export default function ColorList({ colors, onChange: setColors, maxColors, minColors, onMaxColorsReached, onMinColorsReached, shouldAnimate, animationLength, animationOffset, loadFromLeft, defaultColor, flipAddButton, popoverProps, containerProps, className, disableAlpha, colorFormat, swatchLabelProps, removeButtonProps, saveButtonProps, AddButton, RemoveButton, SaveButton, addButtonProps, swatchLabelColor, swatchActiveBorderColor }) {
    const [activeSwatch, setActiveSwatch] = useState({ color: null, index: null, elt: null })
    const [dragSwatch, setDragSwatch] = useState(null)

    const stopAnimation = useRef(!shouldAnimate)

    const colorString = (c) => {
        if (typeof c === "object") {
            if (colorFormat === "hsl") {
                if (c.a && c.a !== 1) c = "hsla(" + Math.round(c.h) + "," + Math.round(c.s * 100) + "%," + Math.round(c.l * 100) + "%," + Math.round(c.a * 100) / 100 + ")"
                else c = "hsl(" + Math.round(c.h) + "," + Math.round(c.s * 100) + "%," + Math.round(c.l * 100) + "%)"
            }
            else if (colorFormat === "rgb") {
                if (c.a && c.a !== 1) c = "rgba(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + "," + Math.round(c.a*100)/100 + ")"
                else c = "rgb(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + ")"
            }
            else throw new Error("Object with neither HSL or RGB c type")
        }
        if (colorFormat === "hex" && c.indexOf('#') === -1) {
            c = "#" + c
        }
        return c
    }

    const addColor = () => {
        stopAnimation.current = true
        if (!maxColors || colors.length < maxColors) {
            var c = defaultColor
            if (!c) {
                if (colorFormat === "rgb"){
                    c = "rgb(255,255,255)"
                }
                else if (colorFormat === "hex"){
                    c = "#ffffff"
                }
                else if (colorFormat === "hsl"){
                    c = "hsl(0, 0%, 100%)"
                }
                else{
                    throw new Error("Invalid color format")
                }
            }
            if (loadFromLeft) {
                setColors([c, ...colors], "add color at index " + (loadFromLeft ? 0 : colors.length))
            }
            else {
                setColors([...colors, c], "add color at index " + (loadFromLeft ? 0 : colors.length))
            }
        }
        else {
            if (onMaxColorsReached) {
                onMaxColorsReached(maxColors)
            }
        }
    }

    const removeIndex = () => {
        stopAnimation.current = true
        if (colors.length > minColors) {
            setColors(chop(colors, activeSwatch.index), "remove color at index " + activeSwatch.index)
            setActiveSwatch({ index: null, color: null, elt: null })
            return true
        }
        else {
            if (onMinColorsReached) {
                onMinColorsReached(minColors)
            }
            return false
        }
    }

    const updateIndex = (c) => {
        c = colorString(c)
        stopAnimation.current = true
        var temp = [...colors]
        temp[activeSwatch.index] = c
        setColors(temp, "update color at index " + activeSwatch.index)
        setActiveSwatch({ index: null, color: null, elt: null })
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setDragSwatch(null)
        setColors(() => arrayMove(colors, oldIndex, newIndex), "moved color from index " + oldIndex + " to index " + newIndex);
    }

    const getClassName = (isDragging) => {
        var temp = "colorSwatchContainerWrapper"
        if (className) {
            temp += " " + className
        }
        if (isDragging) {
            temp += " dragging"
        }
        return temp
    }
    const variants = (time) => {
        return ({
            visible: i => ({
                opacity: 1,
                y: 0,
                transition: {
                    delay: i * animationOffset,
                    duration: time
                },
            }),
            hidden: {
                opacity: 0,
                y: 100
            },
        })
    }

    var { style, remainingContainerProps } = containerProps || {}
    return (
        <>
            <div className={getClassName(dragSwatch)} style={{ width: "max-content", display: "flex", alignItems: "center", flexDirection: flipAddButton ? "row-reverse" : undefined, ...style }} {...remainingContainerProps}>
                <div style={{ overflow: "auto" }}>
                    <div style={{ overflow: "hidden" }} >
                        <SortableContainer lockOffset="0%" onSortEnd={(i) => onSortEnd(i)} onSortStart={() => setDragSwatch(true)} distance={5} axis="x" lockAxis="x" lockToContainerEdges={true} colors={colors}>
                            {colors.map((color, index) => {
                                color = colorString(color)
                                return <SortableItem flipAddButton = {flipAddButton} swatchLabelColor={swatchLabelColor ? (s) => swatchLabelColor(s) : undefined} swatchActiveBorderColor={swatchActiveBorderColor ? (s) => swatchActiveBorderColor(s) : undefined} swatchLabelProps={swatchLabelProps} key={index} colorFormat={colorFormat} animationLength={animationLength} animationOffset={animationOffset} dragSwatch={dragSwatch} stopAnimation={stopAnimation.current} color={color} index={index} itemIndex={index} colors={colors} activeSwatch={activeSwatch} setActiveSwatch={(s) => setActiveSwatch(s)} />
                            })}
                        </SortableContainer>
                    </div>
                </div>
                <div>
                    <motion.div
                        custom={stopAnimation.current || flipAddButton ? 0 : colors.length}
                        animate="visible"
                        initial={stopAnimation.current ? undefined : "hidden"}
                        variants={variants(animationLength)}>
                        {AddButton ?
                            <AddButton addColor={() => addColor()} />
                            :
                            <IconButton {...addButtonProps} onClick={() => addColor()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1rem">
                                    <path d="M492 236H276V20c0-11.046-8.954-20-20-20s-20 8.954-20 20v216H20c-11.046 0-20 8.954-20 20s8.954 20 20 20h216v216c0 11.046 8.954 20 20 20s20-8.954 20-20V276h216c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                                </svg>
                            </IconButton>
                        }
                    </motion.div>
                </div>
            </div >
            <Popover

                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transitionDuration={0}
                elevation={4}
                {...popoverProps}
                anchorEl={activeSwatch.elt}
                open={Boolean(activeSwatch.elt)}
                onClose={() => setActiveSwatch({ index: null, color: null, elt: null })}
            >
                <PickerWrapper SaveButton={SaveButton} RemoveButton={RemoveButton} removeButtonProps={removeButtonProps} saveButtonProps={saveButtonProps} colorFormat={colorFormat} disableAlpha={disableAlpha} defaultColor={activeSwatch.color} remove={() => removeIndex()} update={(c) => updateIndex(c)} />
            </Popover>
        </>
    )
}

const SortableContainer = sortableContainer(({ children }) => {
    return <div className="colorSwatchContainer" >{children}</div>
});

const SortableItem = sortableElement(props => <ColorSwatch {...props} />);

const ColorSwatch = ({ itemIndex: index, color, colors, activeSwatch, setActiveSwatch, stopAnimation, dragSwatch, animationLength, animationOffset, flipAddButton, colorFormat, swatchLabelProps, swatchActiveBorderColor, swatchLabelColor }) => {
    var { style, remainingLabelProps } = swatchLabelProps || {}
    const variants = (time) => {
        return ({
            visible: i => ({
                opacity: 1,
                y: 0,
                transition: {
                    delay: i * animationOffset,
                    duration: time
                },
            }),
            hidden: {
                opacity: 0,
                y: 100
            },
        })
    }
    return (
        <div className="colorSwatchWrapper">
            <motion.div
                custom={stopAnimation ? 0 : (flipAddButton ? index + 1 : index)}
                animate="visible"
                initial={stopAnimation ? undefined : "hidden"}
                variants={variants(animationLength)}
                className="colorSwatchCardContainer" onClick={(e) => setActiveSwatch({ color: colors[index], index, elt: e.currentTarget })}>
                <div className={dragSwatch ? "colorSwatchCard" : "colorSwatchCard hoverable"} style={(index === activeSwatch.index) ? { border: `2px ${swatchActiveBorderColor ? swatchActiveBorderColor(color, colorFormat) : invertColor(color, colorFormat)} solid`, backgroundColor: color, marginTop: "5px", height: "90px", borderTopLeftRadius: ".3rem", borderTopRightRadius: ".3rem" } : { backgroundColor: color,/* border: `2px ${color} solid`,*/ padding: "2px" }} >
                    <span className="colorSwatchLabel" style={{ color: swatchLabelColor ? swatchLabelColor(color, colorFormat) : invertColor(color, colorFormat, true), fontSize: "10px", display: "inline-block", paddingLeft: "3px", paddingRight: "3px", ...style }} {...remainingLabelProps}>{color}</span>
                </div>
            </motion.div>
        </div>
    )
}

const PickerWrapper = ({ defaultColor, remove, update, disableAlpha, colorFormat, removeButtonProps, saveButtonProps, RemoveButton, SaveButton }) => {
    const [color, setColor] = useState(defaultColor)
    const [shakeCountRemove, setShakeCountRemove] = useState(0)
    return (
        <>
            <Picker defaultView={colorFormat} disableAlpha={disableAlpha} color={color} onChange={(c) => setColor(c[colorFormat])} />
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", marginBottom: "6px" }}>
                {
                    RemoveButton ? <RemoveButton removeColor={() => remove()} />
                        :
                        <Shake pose={["shake"]} poseKey={shakeCountRemove}>
                            <Button variant="contained" style={{ marginRight: ".5rem" }}  {...removeButtonProps} onClick={() => {
                                if (remove() === false)
                                    setShakeCountRemove(shakeCountRemove + 1)
                            }}>Remove</Button>
                        </Shake>
                }
                {
                    SaveButton ? <SaveButton saveColor={() => update(color)} />
                        :
                        <Button variant="contained" style={{ marginLeft: ".5rem", paddingLeft: "26.65px", paddingRight: "26.65px" }} {...saveButtonProps} onClick={() => update(color)}>Save</Button>
                }            </div>
        </>
    )
}

const chop = (arr, index) => {
    var ans = []
    for (var i = 0; i < arr.length; i++) {
        if (i !== index) {
            ans.push(arr[i])
        }
    }
    return ans
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}


function invertColor(color, colorFormat, bw) {
    var r = 0
    var g = 0
    var b = 0
    if (colorFormat === "rgb") {
        let arr = color.substring(color.indexOf("(") + 1, color.length).split(",")
        r = parseInt(arr[0])
        g = parseInt(arr[1])
        b = parseInt(arr[2])
    }
    else if (colorFormat === "hsl") {
        let arr = color.substring(color.indexOf("(") + 1, color.length).split(",")
        arr = colorConvert.hsl.rgb(parseInt(arr[0]), parseInt(arr[1].slice(0, -1)), parseInt(arr[2].slice(0, -1)))
        r = arr[0]
        g = arr[1]
        b = arr[2]
    }
    else if (colorFormat === "hex") {
        if (color.indexOf('#') === 0) {
            color = color.slice(1);
        }
        if (color.length === 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        }

        r = parseInt(color.slice(0, 2), 16)
        g = parseInt(color.slice(2, 4), 16)
        b = parseInt(color.slice(4, 6), 16)
    }
    else {
        throw new Error("Invalid color format")
    }
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    }
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
export function invert(color, colorFormat) {
    return invertColor(color, colorFormat)
}
export function invertBlackWhite(color, colorFormat) {
    return invertColor(color, colorFormat, true)
}


PickerWrapper.propTypes = {
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    defaultColor: PropTypes.string,
    disableAlpha: PropTypes.bool,
    colorFormat: PropTypes.oneOf(["hex", "rgb", "hsl"]),
    removeButtonProps: PropTypes.object,
    saveButtonProps: PropTypes.object,
    SaveButton: PropTypes.elementType ,
    RemoveButton: PropTypes.elementType 
}

ColorSwatch.propTypes = {
    itemIndex: PropTypes.number.isRequired,
    colors: PropTypes.array.isRequired,
    activeSwatch: PropTypes.object.isRequired,
    setActiveSwatch: PropTypes.func.isRequired,
    animationLength: PropTypes.number.isRequired,
    animationOffset: PropTypes.number.isRequired,
    colorFormat: PropTypes.oneOf(["hex", "rgb", "hsl"]).isRequired,
    color: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    stopAnimation: PropTypes.bool,
    dragSwatch: PropTypes.bool,
    disableAlpha: PropTypes.bool,
    swatchLabelProps: PropTypes.object,
    swatchLabelColor: PropTypes.func,
    swatchActiveBorderColor: PropTypes.func,
    flipAddButton: PropTypes.bool
}

ColorList.propTypes = {
    colors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    maxColors: PropTypes.number,
    minColors: PropTypes.number,
    onMaxColorsReached: PropTypes.func,
    onMinColorsReached: PropTypes.func,
    shouldAnimate: PropTypes.bool,
    animationLength: PropTypes.number,
    animationOffset: PropTypes.number,
    loadFromLeft: PropTypes.bool,
    defaultColor: PropTypes.string,
    flipAddButton: PropTypes.bool,
    colorFormat: PropTypes.oneOf(["hex", "rgb", "hsl"]),
    popoverProps: PropTypes.object,
    disableAlpha: PropTypes.bool,
    containerProps: PropTypes.object,
    className: PropTypes.string,
    swatchLabelProps: PropTypes.object,
    removeButtonProps: PropTypes.object,
    saveButtonProps: PropTypes.object,
    AddButton: PropTypes.elementType ,
    SaveButton: PropTypes.elementType ,
    RemoveButton: PropTypes.elementType ,
    addButtonProps: PropTypes.object,
    swatchLabelColor: PropTypes.func,
    swatchActiveBorderColor: PropTypes.func
}
ColorList.defaultProps = {
    shouldAnimate: true,
    animationLength: 0.1,
    animationOffset: 0.05,
    loadFromLeft: false,
    flipAddButton: false,
    popoverProps: {},
    disableAlpha: false,
    colorFormat: "hex",
    minColors: 0
}