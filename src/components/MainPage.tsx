import React, { useState } from "react";
import { getPost, scrapeUsernames } from "../utils/scraper";
import { Button } from "./Button";
import { countDays, formatUserDaysList, organizeUserDaysList, replaceImageTags, updateDaysByUsername } from "../utils/emote";
import ListItem from "./ListItem";


export const MainPage = () => {
    const [id, setId] = useState("");
    const [usernames, setUsernames] = useState<string[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [post, setPost] = useState('');
    const [pending, setPending] = useState(false);

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setId(event.target.value);
    };

    const handleScrape = async () => {
        setPending(true);
        const scrapedUsernames = await scrapeUsernames(id, pageCount || 0);
        setUsernames(scrapedUsernames);
        setPending(false);
    };

    const handlePost = async () => {
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
                        type="number"
                        min={0}
                        max={50}
                        value={pageCount}
                        onChange={(e) => {
                            let value = +e.target.value;
                            if (value > 50) {
                                value = 50;
                            } else if (value < 0) {
                                value = 0;
                            }
                            setPageCount(value);
                        }}
                        placeholder="Enter page count"
                        onKeyDown={(e) => {
                            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                e.preventDefault();
                            }
                        }}
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

