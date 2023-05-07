import React, { useState } from "react";
import { getPost, scrapeUsernames } from "../utils/scraper";
import { Button } from "./Button";


export const MainPage = () => {
    const [id, setId] = useState("");
    const [usernames, setUsernames] = useState<string[]>([]);
    const [post, setPost] = useState('');
    const [pending, setPending] = useState(false);

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
    };

    const handleScrape = async () => {
        setPending(true);
        const scrapedUsernames = await scrapeUsernames(id);
        setUsernames(scrapedUsernames);
        setPending(false);
    };

    const handlePost = async () => {
        setPending(true);
        const scrapedPost = await getPost(id);
        const intro = scrapedPost.slice(0, scrapedPost.indexOf('-'));
        const list = scrapedPost.slice(scrapedPost.indexOf('-')).split('<br>').filter(line => !!line);
        setPost(intro + list.map(line => '\n\n' + line).toString());
        setPending(false);
    }

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
                    />
                    <Button 
                        onClick={handleScrape}
                        loading={pending}
                    >
                        Get Models
                    </Button>
                    
                    <Button 
                        onClick={handlePost} 
                        loading={pending}
                    >
                            Make Post
                    </Button>
                    <textarea 
                        value={post}
                        readOnly     
                    />
                    <div style={{textAlign: 'left', width: '100%'}}>
                        <ul>
                            {usernames.map((username, index) => (
                                <li key={index}>{username}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

