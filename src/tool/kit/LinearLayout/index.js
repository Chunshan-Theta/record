import React from 'react';
import './index.scss';

const horizontalDisplayStyle = {
    'spaceeven':'space-evenly',
    'spacebetween':'space-between',
    'spacearound':'space-around',
    'center':'center',
    'left':'left',
    'right':'right',
  'top':"top-vertical",
}

const verticalDisplayStyle = {
    'spaceeven':'space-evenly',
    'spacebetween':'space-between',
    'spacearound':'space-around',
    'center':'center-vertical',
    'left':'left-vertical',
    'right':'right-vertical',
    'top':"top-vertical",
}

const LinearLayout = ({children, background, width,height, marginTop, orientation='', space='', align="center", className='', ...props}) => {
    const getDisplayStyle = (align,orientation) => {
        switch(orientation){
            case'vertical':
                return verticalDisplayStyle[align]
            default:
                return horizontalDisplayStyle[align]
        }
    }

    const getOrientation = (orientation) => {
        switch(orientation) {
            case'vertical':
                return 'vertical'
            default:
                return ''
        }
    }
    return (
        <div style={{width, height, marginTop, background}}
             className={`linear-layout-container ${getDisplayStyle(align,orientation)} ${getOrientation(orientation)}  ${className}`}
             {...props}>
            {children}
        </div>
    );
};

export default LinearLayout;
