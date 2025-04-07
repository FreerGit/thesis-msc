
export default interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
}

export default interface CartItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    quantity: number;
}