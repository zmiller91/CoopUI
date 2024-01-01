'use client'

import React, {useState, ReactNode} from "react";

// https://stackoverflow.com/questions/70612769/how-do-i-recognize-swipe-events-in-react
export default function Swipeable(props:SwipeableProps) {

    const [touchStartX, setTouchStartX] = useState(null)
    const [touchEndX, setTouchEndX] = useState(null)
    
    const [touchStartY, setTouchStartY] = useState(null)
    const [touchEndY, setTouchEndY] = useState(null)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50 

    function onTouchStart(e) {
        setTouchEndX(null) // otherwise the swipe is fired even with usual touch events
        setTouchStartX(e.targetTouches[0].clientX)

        setTouchEndY(null)
        setTouchStartY(e.targetTouches[0].clientY)
    }

    function onTouchMove(e) {
        setTouchEndX(e.targetTouches[0].clientX)
        setTouchEndY(e.targetTouches[0].clientY)
    }

    function onTouchEnd() {
        if (touchStartX && touchEndX) swipeHorizontal()
        if (touchStartY && touchEndY) swipeVertical()
    }

    function swipeHorizontal() {

        const xDistance = touchStartX - touchEndX
        const yDistance = touchStartY - touchEndY
        if (Math.abs(yDistance) >= Math.abs(xDistance)) {
            return;
        }

        const isLeftSwipe = xDistance > minSwipeDistance
        const isRightSwipe = xDistance < -minSwipeDistance

        if (isLeftSwipe && props.onSwipeLeft) {
            props.onSwipeLeft();
        }

        if (isRightSwipe && props.onSwipeRight) {
            props.onSwipeRight();
        }
    }

    function swipeVertical() {

        const xDistance = touchStartX - touchEndX
        const yDistance = touchStartY - touchEndY
        if (Math.abs(xDistance) >= Math.abs(yDistance)) {
            return;
        }

        const isUpSwipe = yDistance > minSwipeDistance
        const isDownSipe = yDistance < -minSwipeDistance

        if (isDownSipe && props.onSwipeDown) {
            props.onSwipeDown();
        }

        if (isUpSwipe && props.onSwipeUp) {
            props.onSwipeUp();
        }
    }


    return (
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            {props.children}
        </div>
    )
}

export interface SwipeableProps {
    children:ReactNode,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    onSwipeUp?: () => void,
    onSwipeDown?: () => void

}