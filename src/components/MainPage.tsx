import React, { useState } from "react";
import { getPost, scrapeUsernames } from "../utils/scraper";
import { Button } from "./Button";
import { countDays, formatUserDaysList, organizeUserDaysList, replaceImageTags, updateDaysByUsername } from "../utils/emote";
import ListItem from "./ListItem";


export const MainPage = () => {
    const [id, setId] = useState("");
    const [usernames, setUsernames] = useState<string[]>([]);
    const [pageCount, setPageCount] = useState('');
    const [post, setPost] = useState('');
    const [pending, setPending] = useState(false);

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
    };

    const scrapeNames = async () => {
        setPending(true);
        const scrapedUsernames = await scrapeUsernames(id, pageCount ? +pageCount : 0);
        setUsernames(scrapedUsernames);
        setPending(false);
    };

    const scrapePost = async () => {
        setPending(true);
        const scrapedPost = await getPost(id);
        const intro = scrapedPost.slice(0, scrapedPost.indexOf('-'));
        const list = scrapedPost.slice(scrapedPost.indexOf('-')).split('<br>').filter(line => !!line);
        // const formattedList = list.map(record => replaceImageTags(record));
        const userDays = list.map(data =>  countDays(data));
        const updatedUserDays = updateDaysByUsername(usernames, userDays);
        const organized = organizeUserDaysList(updatedUserDays);
        // setPost(intro + (organized).map(line => '\n\n' + `${line.user} - ${line.days}`).toString());
        setPost(formatUserDaysList(organized));
        setPending(false);
    }

    // Copy Button
    const [copyText, setCopyText] = useState('Copy to clipboard');
    const copyToClipboard = () => {
        setCopyText('Copied');

        navigator.clipboard.writeText(post)

        setTimeout(() => {
            setCopyText('Copy to Clipboard');
        }, 1000);
    }

    const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    
        // Validate the input against the desired range
        let validatedValue = numericValue;
        if (numericValue !== '') {
          const numeric = parseInt(numericValue, 10);
          if (numeric > 50) {
            validatedValue = '50';
          } else if (numeric < 0) {
            validatedValue = '0';
          }
        }
    
        setPageCount(validatedValue);
      };

    return (
        <div>
            <header className="App-header">
                <h1>Night Crew</h1>
            </header>
            <div style={{width: '100vw', display: 'flex', justifyContent: "center"}}>
                <div className="main-interface">
                    <input
                        type="text"
                        value={id}
                        onChange={handleUrlChange}
                        placeholder="Enter the forum post ID"
                        onKeyDown={(e) => {
                            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <input
                        type="text"
                        value={pageCount}
                        onChange={handlePageCountChange}
                        placeholder="Enter page count"
                        onKeyDown={(e) => {
                            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                e.preventDefault();
                            }
                        }}
                    />
                    <Button 
                        onClick={scrapeNames}
                        loading={pending}
                    >
                        Get Models
                    </Button>
                    
                    <Button 
                        onClick={scrapePost} 
                        loading={pending}
                    >
                            Make Post
                    </Button>
                    <textarea 
                        value={post}
                        readOnly     
                    />
                    {post.length > 0 && <Button onClick={copyToClipboard}>{copyText}</Button>}
                    <div style={{textAlign: 'left', width: '100%'}}>
                        <ul>
                            {usernames.map((username, index) => (
                                // <li key={index}>{username}</li>
                                <ListItem key={index} item={username} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

