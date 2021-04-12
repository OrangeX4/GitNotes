import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
ReactDOM.render(
    <React.StrictMode>
        <App />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css"></link>
        {/* <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.js" integrity="sha384-1Or6BdeNQb0ezrmtGeqQHFpppNd7a/gw29xeiSikBbsb44xu3uAo8c7FwbF5jhbd" crossOrigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossOrigin="anonymous"
            // @ts-ignore
            onLoad={() => renderMathInElement(document.body)}></script> */}
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/> */}
        {/* <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/contrib/mhchem.min.js" crossOrigin="anonymous"></script> */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-dark.min.css" />
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
