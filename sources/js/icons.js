// Icons from https://heroicons.com/

const chevronDownOutline =
`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>`;

const eyeSlashOutline =
`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395
            M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774
            M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243
            m4.242 4.242L9.88 9.88"
    />
</svg>`;

const bellOutline =
`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75
            a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0
            a3 3 0 11-5.714 0"
    />
</svg>`;

const mapPin16 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009
            a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7
            c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5
            a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
    />
</svg>`;

const user24 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695
            A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
    />
</svg>`;

const computerDesktop16 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" >
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M2 4.25A2.25 2.25 0 0 1 4.25 2h7.5A2.25 2.25 0 0 1 14 4.25v5.5A2.25 2.25 0 0 1 11.75 12h-1.312
            q.15.192.328.36a.75.75 0 0 1 .234.545v.345a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.345
            a.75.75 0 0 1 .234-.545q.178-.167.328-.36H4.25A2.25 2.25 0 0 1 2 9.75zm2.25-.75a.75.75 0 0 0-.75.75v4.5
            c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75z"
    />
</svg>`;

const clipboardDocumentCheck16 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
        <path
            d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014
                A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2M10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5
                a.75.75 0 0 0-.75.75V4z"
        />
        <path
            d="M2 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm6.585 1.08a.75.75 0 0 1 .336 1.005
                l-1.75 3.5a.75.75 0 0 1-1.16.234l-1.75-1.5a.75.75 0 0 1 .977-1.139l1.02.875l1.321-2.64
                a.75.75 0 0 1 1.006-.336"
        />
    </g>
</svg>`;

const informationCircle16 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"  fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0M9 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M6.75 8a.75.75 0 0 0 0 1.5h.75v1.75
            a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8z"
    />
</svg>`;

const calendarDays16 =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
    <path
        d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5
            a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 8.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 9.5
            A.75.75 0 1 0 8 11a.75.75 0 0 0 0-1.5Z"
    />
    <path fill-rule="evenodd"  clip-rule="evenodd"
        d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75
            a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7
            a1 1 0 0 1-1-1V7Z"
    />
</svg>`

export {
    chevronDownOutline as collapseIcon,
    eyeSlashOutline as hideIcon,
    bellOutline as bellIcon,
    mapPin16 as locationIcon,
    user24 as npcIcon,
    computerDesktop16 as terminalIcon,
    clipboardDocumentCheck16 as prereqIcon,
    informationCircle16 as infoIcon,
    calendarDays16 as cycleIcon,
};
