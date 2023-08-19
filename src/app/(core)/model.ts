
export interface ShipProps {
    ship: Ship;
    onSelection: (ship: Ship) => any;
    selected: boolean;
}

export interface BoardSquareProps {
    square: Square;
    onClick: (square: Square) => any;
    onMouseEnter: (square: Square) => any;
    onMouseOut: (square: Square) => any;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface Square {
    ship?: Ship;
    hoverColor?: string;
    isHit: boolean;
    coords: Coordinates;
}

export interface Ship {
    id: number;
    name: string;
    size: number;
    color: string;
    placed?: boolean;
}
