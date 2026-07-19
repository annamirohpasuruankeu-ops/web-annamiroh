import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src="/images/LOGO 1 CABANG.png"
            alt="Annamirah Logo Icon"
            className={`${props.className || ''} object-contain`}
        />
    );
}
