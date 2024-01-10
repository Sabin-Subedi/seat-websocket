import {rem} from '@mantine/core';

interface SeatIconProps extends React.ComponentPropsWithoutRef<'svg'> {
    size?: number | string;
}

export function SeatIcon({size, fill,}: SeatIconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             fill={fill || "none"}
             stroke="#111"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="1.5"
             width="32"
             height="32"
             viewBox="0 0 32 32"
             style={{width: rem(size), height: rem(size),}}>
            <path
                d="M9.88182 8.78788L8.56182 2.84848C7.53516 2.84848 5.56966 3.35758 5.92166 5.39394C6.27366 7.4303 7.53499 18.6869 8.12166 24.0606C8.12166 23.6364 8.47382 22.7879 9.88182 22.7879H22.2018C23.6098 22.7879 23.9618 23.6364 23.9618 24.0606C24.5485 18.6869 25.8098 7.4303 26.1618 5.39394C26.5138 3.35758 24.5485 2.84848 23.5218 2.84848L22.8618 5.81818L22.16 8.36364C21.72 9.63636 21.8498 10.0606 20.4418 10.0606H11.6418C10.2338 10.0606 10.28 10.0606 9.88182 8.78788Z"
                fill="currentColor"/>
            <path
                d="M10.28 7.93939L9.18808 3.02627C9.07069 2.49807 9.4883 2 10.0485 2H21.9515C22.5117 2 22.9293 2.49807 22.8119 3.02627L21.72 7.93939C21.28 9.63636 20.76 9.63636 19.8 9.63636H12.2C11.24 9.63636 10.72 9.63636 10.28 7.93939Z"
                fill="currentColor"/>
            <path
                d="M5 19.3939C5 18.691 5.59098 18.1212 6.32 18.1212C7.04902 18.1212 7.64 18.691 7.64 19.3939V23.6364C7.64 24.3393 7.04902 24.9091 6.32 24.9091C5.59098 24.9091 5 24.3393 5 23.6364V19.3939Z"
                fill="currentColor"/>
            <path
                d="M24.36 19.3939C24.36 18.691 24.951 18.1212 25.68 18.1212C26.409 18.1212 27 18.691 27 19.3939V23.6364C27 24.3393 26.409 24.9091 25.68 24.9091C24.951 24.9091 24.36 24.3393 24.36 23.6364V19.3939Z"
                fill="currentColor"/>
            <path
                d="M21.4008 23.2121H10.5985C8.95994 23.2121 8.07938 24.0606 8.59814 25.6078C9.14509 27.2392 9.66502 28.4029 9.79839 28.8021C9.93175 29.2014 10.4385 30 11.3987 30H20.6006C21.5608 30 22.0676 29.2014 22.2009 28.8021C22.3343 28.4029 22.8561 27.2398 23.4012 25.6078C23.9462 23.9759 23.04 23.2121 21.4008 23.2121Z"
                fill="currentColor"/>
        </svg>

    );
}