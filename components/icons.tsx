import React from 'react';

interface IconProps {
    className?: string;
    title?: string;
}

export const ShareIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.15-4.15c.52.47 1.2.77 1.96.77 1.38 0 2.5-1.12 2.5-2.5S19.38 3 18 3s-2.5 1.12-2.5 2.5c0 .24.04.47.09.7L8.45 10.35a2.49 2.49 0 00-1.96-.77c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.76 0 1.44-.3 1.96-.77l7.15 4.15c-.05.23-.09.46-.09.7 0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" />
    </svg>
);


export const RetakeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.947 14.947 0 0114.386 1.614M20 20a14.947 14.947 0 01-14.386-1.614" />
    </svg>
);

export const GalleryIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Gold Diamond Icon for Premium Access
export const DiamondGoldIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="#FBBF24" stroke="#92400E" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5l-9.5 9.5 9.5 11.5 9.5-11.5-9.5-9.5z" />
    </svg>
);

// Silver Diamond Icon for Basic Access
export const DiamondSilverIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5l-9.5 9.5 9.5 11.5 9.5-11.5-9.5-9.5z" />
    </svg>
);

export const EmailIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
);

export const AdminIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.22 1.02.684 1.11 1.226l.06.349m-3.04 0l.06-.349m2.92 0l-.06.349m-2.86 8.35a4.5 4.5 0 016.364 0l2.047 2.047a.5.5 0 01-.354.853H6.66a.5.5 0 01-.354-.853l2.047-2.047zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5z" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.672-2.672L11.25 18l1.938-.648a3.375 3.375 0 002.672-2.672L16.75 13.5l.648 1.938a3.375 3.375 0 002.672 2.672L21.75 18l-1.938.648a3.375 3.375 0 00-2.672 2.672z" />
    </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

export const TranslateIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.625M21 21l-5.25-11.625M3.75 5.25h16.5M4.5 12h15M5.25 18h13.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25c0-1.036.84-1.875 1.875-1.875h1.5c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-1.5A1.875 1.875 0 013.75 9V5.25z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.75c0-1.036.84-1.875 1.875-1.875h1.5c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-1.5a1.875 1.875 0 01-1.875-1.875v-3.75z" />
    </svg>
);

export const BrazilFlagIcon: React.FC<IconProps> = ({ className = "w-5 h-5", title }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 9 6">
        {title && <title>{title}</title>}
        <clipPath id="a"><path d="M0 0h9v6H0z"/></clipPath>
        <g clipPath="url(#a)">
            <path fill="#009639" d="M0 0h9v6H0z"/>
            <path fill="#FEDD00" d="M4.5 1 1 3l3.5 2 3.5-2z"/>
            <path fill="#001489" d="M4.5 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </g>
    </svg>
);

export const USFlagIcon: React.FC<IconProps> = ({ className = "w-5 h-5", title }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 1200 630">
        {title && <title>{title}</title>}
        <path fill="#B22234" d="M0 0h1200v630H0z"/>
        <path fill="#FFF" d="M0 54h1200v54H0zm0 108h1200v54H0zm0 108h1200v54H0zm0 108h1200v54H0zm0 108h1200v54H0zm0 108h1200v54H0z"/>
        <path fill="#3C3B6E" d="M0 0h480v378H0z"/>
        <g fill="#FFF">
            <path d="M60 21.6 74.4 68.4 30 42h88.8L45.6 68.4zM140 21.6 154.4 68.4 110 42h88.8L125.6 68.4zM220 21.6 234.4 68.4 190 42h88.8L205.6 68.4zM300 21.6 314.4 68.4 270 42h88.8L285.6 68.4zM380 21.6 394.4 68.4 350 42h88.8L365.6 68.4zM100 93.6 114.4 140.4 70 114h88.8L85.6 140.4zM180 93.6 194.4 140.4 150 114h88.8L165.6 140.4zM260 93.6 274.4 140.4 230 114h88.8L245.6 140.4zM340 93.6 354.4 140.4 310 114h88.8L325.6 140.4zM60 165.6 74.4 212.4 30 186h88.8L45.6 212.4zM140 165.6 154.4 212.4 110 186h88.8L125.6 212.4zM220 165.6 234.4 212.4 190 186h88.8L205.6 212.4zM300 165.6 314.4 212.4 270 186h88.8L285.6 212.4zM380 165.6 394.4 212.4 350 186h88.8L365.6 212.4zM100 237.6 114.4 284.4 70 258h88.8L85.6 284.4zM180 237.6 194.4 284.4 150 258h88.8L165.6 284.4zM260 237.6 274.4 284.4 230 258h88.8L245.6 284.4zM340 237.6 354.4 284.4 310 258h88.8L325.6 284.4zM60 309.6 74.4 356.4 30 330h88.8L45.6 356.4zM140 309.6 154.4 356.4 110 330h88.8L125.6 356.4zM220 309.6 234.4 356.4 190 330h88.8L205.6 356.4zM300 309.6 314.4 356.4 270 330h88.8L285.6 356.4zM380 309.6 394.4 356.4 350 330h88.8L365.6 356.4z"/>
        </g>
    </svg>
);

export const SpainFlagIcon: React.FC<IconProps> = ({ className = "w-5 h-5", title }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 750 500">
        {title && <title>{title}</title>}
        <path fill="#c60b1e" d="M0 0h750v500H0z"/>
        <path fill="#ffc400" d="M0 125h750v250H0z"/>
        <g transform="translate(218.75 206.25) scale(3.125)">
            <g fill="#c60b1e"><path d="M14 2h4v20h-4zM26 2h4v20h-4z"/></g>
            <path fill="#ffc400" d="M14 0h16v6H14z"/>
            <g fill="#c60b1e"><path d="M14 2h2v4h-2zM16 2h2v4h-2zM26 2h2v4h-2zM28 2h2v4h-2z"/></g>
            <path fill="#99111c" d="M22 6a7 7 0 0 0-6.9 5.2.5.5 0 0 1-.9.1 8 8 0 1 1 9.6 0 .5.5 0 0 1-.9-.1A7 7 0 0 0 22 6"/>
            <path fill="#c60b1e" d="M15 11h14v2H15z"/>
            <path fill="#4152a1" d="M18 12h2v4h-2zM24 12h2v4h-2z"/>
            <path fill="#c60b1e" d="M15 13h2v1H15zM27 13h2v1H27zM15 22h14v10H15z"/>
            <path fill="#4152a1" d="M15 22h14v2H15z"/>
            <path fill="#c60b1e" d="M15 24h14v2H15z"/>
            <path fill="#4152a1" d="M15 26h14v2H15z"/>
            <path fill="#c60b1e" d="M15 28h14v2H15z"/>
            <path fill="#ffc400" d="M21 24.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
            <path fill="none" stroke="#6b6d6e" d="M22 24.5a1 1 0 0 1-2 0m2-1a1 1 0 0 1-2 0m2-1a1 1 0 0 1-2 0"/>
            <path fill="#c60b1e" d="M33 22h2v10h-2zM5 22h2v10H5z"/>
            <g fill="#ffc400"><path d="M7 22h2v2H7zM31 22h2v2H31z"/><path d="M7 30h2v2H7zM31 30h2v2H31z"/></g>
            <path fill="#c60b1e" d="M9 22h22v2H9zM9 30h22v2H9z"/>
            <path fill="silver" d="M18 4h8v2h-8z"/>
        </g>
    </svg>
);

export const SoundIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5 5 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const ClipboardCopyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 8.75H12.75C12.1977 8.75 11.75 8.30228 11.75 7.75V5.25C11.75 4.69772 12.1977 4.25 12.75 4.25H18.25C18.8023 4.25 19.25 4.69772 19.25 5.25V10.75C19.25 11.3023 18.8023 11.75 18.25 11.75H15.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.75 12.25H5.25C4.69772 12.25 4.25 11.8023 4.25 11.25V5.75C4.25 5.19772 4.69772 4.75 5.25 4.75H10.75C11.3023 4.75 11.75 5.19772 11.75 5.75V8.25" />
  </svg>
);


export const CheckCircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016h-.008v-.016z" />
  </svg>
);