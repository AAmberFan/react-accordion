import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

const Search = () =>{
    const [term, setTerm] = useState('programming');
    const [debouncedTerm, setDebouncedTerm] = useState('programming');
    const [results, setResults] = useState([]);

    useEffect(()=>{
        const timerId = setTimeout(()=>{
            setDebouncedTerm(term);
        },1000);

        return () =>{
            clearTimeout(timerId);
        }
    },[term]);

    useEffect(()=>{
        const search = async () =>{
            const {data} = await axios.get('https://en.wikipedia.org/w/api.php',{
                params:{
                    action: 'query',
                    list: 'search',
                    orgin: '*',
                    format: 'json',
                    srsearch: debouncedTerm,
                }
            });
            setResults(data.query.search);
            
        };
        if(debouncedTerm){
            search();   
           }
        
    },[debouncedTerm]);

    

    const renderedResults = results.map((result)=>{
        return (
            <div key={result.pageid} className="item">
                <div className="right floated content">
                    <a 
                    className="ui button"
                    target="_blank"
                    href={`https://en.wikipedia.org?curid=${result.pageid}`}>Go</a>
                </div>
                <div className="content">
                    <div className="header">
                        {result.title}
                    </div>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>
                  
                </div>
            </div>
        )
    })

    return(
        <div>
            <div className="ui form">
                <div className="field">
                    <label>Enter Search Term</label>
                    <input
                     value={term}
                     type="text" 
                     className="input"
                     onChange={e=>setTerm(e.target.value)}
                     />
                </div> 
            </div>
            <div className="ui celled list">
                {renderedResults}
            </div>
        </div>
    );
}

export default Search;