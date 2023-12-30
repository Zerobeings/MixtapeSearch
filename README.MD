# MixtapeSearch

MixtapeSearch is a React component that provides a search bar for fetching and displaying NFTs from different networks. It uses the `nft-fetcher` library to fetch NFTs based on the user's search input.

## Installation

```bash
yarn add mixtape-search
```

## Usage

Create a component in your project and import the `MixtapeSearch` component from the `mixtape-search` package.

```jsx
import MixtapeSearch from "mixtape-search"
import { useState, useEffect } from "react";

export default function MixtapeSearchPackNOSSR(){
  const [fetchedNFTs, setFetchedNFTs] = useState<any[]>([]);

  const handleNFTsFetched = (nfts: any[]) => {
      setFetchedNFTs(nfts);
  };
  console.log("fetchedNFTs", fetchedNFTs);

  return (
    <div>
      <MixtapeSearch 
        activeNetwork={"ethereum"}
        theme={"dark"}
        onNFTsFetched={handleNFTsFetched}
        />
    </div>
  )
}
```

Next, dynamically import the `MixtapeSearchPackNOSSR` component in your page.

```jsx
import dynamic from "next/dynamic";
const MixtapeSearchPackNOSSR = dynamic(() => import('../components/MixtapeSearch/Searcher'), { ssr: false });

export default function Home() {
  return (
    <div>
      <MixtapeSearchPackNOSSR />
    </div>
  )
}
```

## Props

- `activeNetwork`: The active blockchain network. Default is 'ethereum'.
- `limit`: The maximum number of NFTs to fetch.
- `start`: The starting index for fetching NFTs.
- `where`: An array of conditions for fetching NFTs.
- `select`: The fields to select from the fetched NFTs.
- `dbURL`: The URL of the database to fetch NFTs from.
- `theme`: The theme of the search bar. Can be 'dark' or 'light'.
- `onNFTsFetched`: A callback function that is called when NFTs are fetched. It receives the fetched NFTs as an argument.
- `style`: An object containing CSS styles for various elements of the search bar.
- `classNames`: An object containing class names for various elements of the search bar.

## Styles and ClassNames

You can customize the appearance of the search bar by providing CSS styles and class names for various elements. The `style` prop is an object where the keys are the names of the elements and the values are CSS style objects. The `classNames` prop is similar, but the values are class names.

Here's an example of how you can use the `style` and `classNames` props to customize the appearance of the MixtapeSearch component:

```jsx
import MixtapeSearch from 'mixtape-search';

<MixtapeSearch
  activeNetwork={"ethereum"}
  limit={10}
  start={0}
  theme={"dark"} // or "light"
  onNFTsFetched={(nfts) => console.log(nfts)}
  style={{
    searchContainer: {
      backgroundColor: '#f5f5f5',
      padding: '10px',
    },
    searchInput: {
      fontSize: '18px',
      padding: '10px',
    },
    searchButton: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
    },
    resultsContainer: {
      marginTop: '20px',
    },
    resultItem: {
      borderBottom: '1px solid #ddd',
      padding: '10px 0',
    },
  }}
  classNames={{
    searchContainer: 'my-search-container',
    searchInput: 'my-search-input',
    searchButton: 'my-search-button',
    resultsContainer: 'my-results-container',
    resultItem: 'my-result-item',
  }}
/>
```

In this example, the `style` prop is used to provide CSS styles for the search container, search input, search button, results container, and result items. The `classNames` prop is used to provide custom class names for the same elements.

Please note that the actual style and class names that you can use will depend on the implementation of the MixtapeSearch component. The keys used in the `style` and `classNames` objects (like `searchContainer`, `searchInput`, etc.) are just examples and might not correspond to the actual elements in the MixtapeSearch component. You'll need to refer to the MixtapeSearch documentation or source code to find out the correct keys to use.


## Fetching NFTs

When the user types in the search bar, the component fetches NFTs that match the user's input. The fetched NFTs are passed to the `onNFTsFetched` callback function.

Suggestions are displayed in a dropdown menu below the search bar. The user can click on a suggestion to select it. When a suggestion is selected, the `onNFTsFetched` callback function is called with the selected NFTs as an argument.

A contract address can also be entered in the search bar. When a contract address is entered, the component fetches all the NFTs from that contract and passes them to the `onNFTsFetched` callback function.

If a collection does not appear it has not been indexed yet. To request a collection to be indexed, please submit a request at https://indexer.locatia.app. Once the collection is indexed it will also appear in the suggestions dropdown.

## Network Support

The component supports multiple blockchain networks. The active network can be set using the `activeNetwork` prop. The default network is 'ethereum'.