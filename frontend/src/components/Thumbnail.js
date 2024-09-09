import React from 'react';

const rootPath = 'https://polypropylene.website/bazarakiscraper/dat';

export default function Thumbnail({ thumbnail }) {
    const url = t.path.substr(0, 4) === 'http' ? t.path : rootPath +"/"+ t.path;

    return (
        <a target="_blank" href={url}>
            <img src={url} alt="" />
        </a>
    )
} 