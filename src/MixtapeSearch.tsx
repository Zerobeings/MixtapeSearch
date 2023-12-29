import React, { useState, useEffect, useMemo } from 'react';
import { getMixtapeNFTs } from 'nft-fetcher';
import styles from './MixtapeSearch.module.css';
import { CID } from 'multiformats/cid'; 

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

interface Collection {
    name?: string;
    contract?: string;
    image?: string;
    symbol?: string;
}


interface Collections {
    [key: string]: Collection[];
}

const MixtapeSearch = ({
    activeNetwork, 
    limit, 
    start, 
    where, 
    select, 
    dbURL,
    theme, 
    onNFTsFetched, 
    style = {
        searchBarContainer: {},
        selectNetwork: {},
        searchBar: {},
        searchBarMatic: {},
        clearButton: {},
        suggestionsContainer: {},
        suggestion: {},
        suggestionLogo: {},
    },
    classNames = {
        searchBarContainer: "",
        selectNetwork: "",
        searchBar: "",
        searchBarMatic: "",
        clearButton: "",
        suggestionsContainer: "",
        suggestion: "",
        suggestionLogo: "",
    }}:SearchBarProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionCache, setCollectionCache] = useState<Collections>({});
  const darkTheme = useMemo(() => theme === 'dark', [theme]);
  onNFTsFetched = onNFTsFetched || (() => {});

  const darkMode = useMemo(() => ({
    searchBarContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarContainer,
    },
    searchBar: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBar,
    },
    searchBarMatic: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.searchBarMatic,
    },
    suggestionsContainer: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionsContainer,
    },
    suggestionLogo: {
        backgroundColor: darkTheme ? '#1f1f1f' : '#fff',
        color: darkTheme ? '#fff' : '#000',
        ...style.suggestionLogo,
    },
 }), [darkTheme, style]);

    useEffect(() => {
        if (activeNetwork) {
            setNetwork(activeNetwork);
        }
    }
    , [activeNetwork]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setContractAddress(query);
        setShowSuggestions(query !== '');
    };
    
    const handleClearSearch = () => {
        setContractAddress('');
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (search: string) => {
        setIsProcessing(true);
        setContractAddress('');
        setShowSuggestions(false);
        console.log('Fetching NFTs...');
        getMixtapeNFTs(search, network)
            .then((results:any) => {
                console.log(results);
                if (onNFTsFetched) {
                    onNFTsFetched(results);
                }
                setIsProcessing(false);
            })
            .catch((e:any) => {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                    console.log(`If collection is missing, submit an index request at https://indexer.locatia.app`);
                } else {
                    console.error('Caught an unknown error:', e);
                }
                setIsProcessing(false);
            });
    };
    
    
    useEffect(() => {
        const fetchCollections = async () => {
            // Check cache first
            if (collectionCache[network]) {
                setCollections(collectionCache[network]);
                return;
            }
        
            try {
                let url;
                switch (network) {
                    case "ethereum":
                        url = "https://lib.locatia.app/eth-directory/directory.json";
                        break;
                    case "polygon":
                        url = "https://lib.locatia.app/poly-directory/directory.json";
                        break;
                    default:
                        url = "https://lib.locatia.app/eth-directory/directory.json";
                }
        
                const response = await fetch(url);
                const data = await response.json();
        
                const newData = data.map((collection: any) => {
                    if (collection.image && collection.image.startsWith("ipfs://")) {
                        const parts = collection.image.replace('ipfs://', '').split('/');
                        const CIDString = parts[0];
                        //check if valid CID
                        const base32Regex = /^[A-Z2-7]+=*$/;
                        if (base32Regex.test(CIDString)) {
                            return collection;
                        }
     
                        if (CIDString) {
                            const CIDv0 = CID.parse(CIDString);
                            const CIDv1Base32 = CIDv0.toV1().toString();
                            parts.shift();
                            const filePath = parts.join('/'); 
                    
                            if (filePath) {
                                collection.image = `https://${CIDv1Base32}.ipfs.dweb.link/${filePath}`;
                            } else {
                                collection.image = `https://${CIDv1Base32}.ipfs.dweb.link/`;
                            }
                        }
                 
                    }
                    return collection;
                });
                
                setCollections(newData);
                setCollectionCache({ ...collectionCache, [network]: newData });
            } catch (error) {
                console.error(`Suggestions: ${error}`);
            }
        };
        fetchCollections();
   
    }, [network, collectionCache]);
    
  return (
    <div>
        <div className={`${styles.searchBarContainer} ${classNames.searchBarContainer || ""}`} 
        style={style.searchBarContainer && darkMode ? darkMode.searchBarContainer : style.searchBarContainer}>
         {network === "ethereum" ? (
                <img 
                    className={styles.networkImage}
                    src="https://lib.locatia.app/network-images/eth.png"
                    alt="ethereum"
                    width={30} 
                    height={30}
                    loading="lazy"
                />
            ) : network === "polygon" && (
                <img 
                    className={styles.networkImage}
                    src="https://lib.locatia.app/network-images/matic.png"
                    alt="polygon"
                    width={30} 
                    height={30}
                    loading="lazy"
                />
            )    
            }
            <input
                style={style.searchBar && darkMode ? darkMode.searchBar : style.searchBar}
                className={`${network === "ethereum" ? styles.searchBar : styles.searchBarMatic} ${styles.searchBar || ""}`}
                type="text"
                value={contractAddress}
                placeholder="Name/Contract Address"
                onChange={handleInputChange}
                onKeyPress={event => {
                    if (event.key === 'Enter' && contractAddress) {
                        handleSuggestionClick(contractAddress);
                        };
                    }}
                disabled={isProcessing}
            />
            {contractAddress && (
            <button 
                style={style.clearButton}
                className={`${styles.clearButton} ${classNames.clearButton || ""}`} 
                onClick={handleClearSearch} 
                aria-label="Clear search"
            >
                X
            </button>
            )}
        </div>
        {showSuggestions && (
        <div
            style={style.suggestionsContainer && darkMode ? darkMode.suggestionsContainer : style.suggestionsContainer}
            className={`${styles.suggestionsContainer} ${classNames.suggestionsContainer || ""} `}
        >
          {collections && collections
              .filter((collection) =>
              {collection.name && collection.name.toLowerCase().includes(contractAddress.toLowerCase())}
              )
              .slice(0, 6)
              .map((collection, index) => (
                <div
                    key={index}
                    style={style.suggestion}
                    className={`${styles.suggestion} ${classNames.suggestion || ""}`}
                    onClick={() => {
                        if (collection.contract){
                        handleSuggestionClick(collection.contract)
                        }
                    }}
                >
                    <img 
                        src={collection.image} 
                        alt={collection.contract}
                        style={style.suggestionLogo}
                        className={`${styles.suggestionLogo} ${classNames.suggestionLogo || ""}`} 
                        width={20} 
                        height={20}
                        loading="lazy"
                    />
                    <span>{collection.name}</span>
                </div>
            ))}
        </div>
        )}
    </div>
  );
};

export default MixtapeSearch;
