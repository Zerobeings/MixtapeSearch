import React from 'react';
interface SearchBarProps {
    activeNetwork?: string;
    limit?: number;
    start?: number;
    where?: string[];
    select?: string;
    dbURL?: string;
    theme?: string;
    onNFTsFetched?: (nfts: any[]) => void;
    style?: {
        searchBarContainer?: React.CSSProperties;
        selectNetwork?: React.CSSProperties;
        searchBar?: React.CSSProperties;
        searchBarMatic?: React.CSSProperties;
        clearButton?: React.CSSProperties;
        suggestionsContainer?: React.CSSProperties;
        suggestion?: React.CSSProperties;
        suggestionLogo?: React.CSSProperties;
    };
    classNames?: {
        searchBarContainer?: string;
        selectNetwork?: string;
        searchBar?: string;
        searchBarMatic?: string;
        clearButton?: string;
        suggestionsContainer?: string;
        suggestion?: string;
        suggestionLogo?: string;
    };
}
declare const MixtapeSearch: ({ activeNetwork, limit, start, where, select, dbURL, theme, onNFTsFetched, style, classNames }: SearchBarProps) => React.JSX.Element;
export default MixtapeSearch;
