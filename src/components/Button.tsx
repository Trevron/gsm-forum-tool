import React from "react";

interface IButton {
    onClick?: () => void;
    loading?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<IButton> = ({ onClick, loading, children}) => {

    return (
        <button
            style={{position: 'relative'}}
            onClick={onClick}>
                {children}
                <div 
                    style={{position: 'absolute', right: '20px'}} 
                    className={loading ? 'loading' : ''}
                />
        </button>
    );
}