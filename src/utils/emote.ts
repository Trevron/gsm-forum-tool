export const getEmote = (img: string): string => {
    switch (img) {
        case ('smiley2.gif'):
            return ":-)";
        case ('smiley10.gif'):
            return ":-(";
        case ('smiley12.gif'):
            return "*cloud*";
        case ('smiley13.gif'):
            return "*star*";
        case ('smiley14.gif'):
            return "*I*";
        default:
            return img;
    }
};

export const replaceImageTags = (record: string): string => {
    const imgTagRegex = /<img src="([^"]+)">/g;
    return record.replace(imgTagRegex, (match, src) => {
        const fileName = src.substring(src.lastIndexOf("/") + 1, src.length);
        return getEmote(fileName);
    });
};

export const countDays = (data: string): {user: string, days: number} => {
    // Regular expressions to match emote strings
    const cloudRegex = /\*cloud\*/g;
    const smileyRegex = /:-\)/g;
    const starRegex = /\*star\*/g;
    const iRegex = /\*I\*/g;
    const sadFaceRegex = /:-\(/g;

    // Function to convert emote strings to the number of days
    const convertEmoteToDays = (str: string): number => {
    let days = 0;

    const cloudMatches = str.match(cloudRegex);
    if (cloudMatches) {
        days += cloudMatches.length * 10;
    }

    const smileyMatches = str.match(smileyRegex);
    if (smileyMatches) {
        days += smileyMatches.length * 5;
    }

    const starMatches = str.match(starRegex);
    if (starMatches) {
        days += starMatches.length * 1;
    }

    const iMatches = str.match(iRegex);
    if (iMatches) {
        days += iMatches.length * 1;
    }

    const sadFaceMatches = str.match(sadFaceRegex);
    if (sadFaceMatches) {
        days += sadFaceMatches.length * 5;
    }

    return days;
    };

    // Parse the data and convert emote strings to the number of days
    const parseData = (data: string): { user: string; days: number } => {
    const matches = data.match(/-(\w+)\s*(.*)/);
    if (matches && matches.length === 3) {
        const user = matches[1];
        const emoteString = matches[2];

        const days = convertEmoteToDays(emoteString);

        return { user, days };
    }

    return { user: '', days: 0 };
    };

    // Parse the data and get the result
    const result = parseData(data);
    return result;
}