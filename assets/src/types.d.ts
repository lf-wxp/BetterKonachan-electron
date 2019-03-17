declare module '*.json' {
    const value: any;
    export default value;
}
declare module '*.css' {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module 'react-stack-grid' {
    const StackGrid: any;
    const transitions: any;
    export { transitions };
    export default StackGrid;
}
