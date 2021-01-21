import React from 'react';
import './index.scss';

const verticalPosition = {
    'center':'center-vertical',
    'left':'left-vertical',
    'right':'right-vertical',
}

const horizontalPosition = {
    'center':'center',
    'left':'left',
    'right':'right',
}

const Item = ({children,width,height, display='center' ,direction='', className='',...props}) => {
    const getDisplayStyle = (display,direction) => {
        switch(direction){
            case'vertical':
                return verticalPosition[display]
            default:
                return horizontalPosition[display]
        }
    }

    const getDirection = (direction) => {
        switch(direction) {
            case'vertical':
                return 'vertical'
            default:
                return ''
        }
    }
    return (
        <div style={{width:`${width}px`,height:`${height}px`}} 
             className={`${className} flex ${getDisplayStyle(display,direction)} ${getDirection(direction)}`} 
             {...props}
        >
            {children}
        </div>
    );
};

export default Item;