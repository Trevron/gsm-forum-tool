export interface UserDays {
    user: string;
    days: number;
}

export const getEmote = (img: string): string => {
    switch (img) {
        case "smiley2.gif": //:-)
            return ":-)";
        case "smiley10.gif": // :-(
            return ":-(";
        case "smiley12.gif": // *cloud*
            return "*cloud*";
        case "smiley13.gif": // *star*
            return "*star*";
        case "smiley14.gif": // *I*
            return "*I*";
        default:
            return img;
    }
};

const emoteToDays = (emote: string): number => {
    switch (emote) {
        case "*star*":
            return 1;
        case ":-)":
            return 5;
        case ":-(":
            return 10;
        case "*cloud*":
            return 15;
        case "*I*":
            return 20;
        default:
            return 0;
    }
};

export const daysToEmotes = (days: number): string[] => {
    const emotes: string[] = [];

    while (days >= 20) {
        emotes.push("*I*");
        days -= 20;
    }
    while (days >= 15) {
        emotes.push("*cloud*");
        days -= 15;
    }
    while (days >= 10) {
        emotes.push(":-(");
        days -= 10;
    }
    while (days >= 5) {
        emotes.push(":-)");
        days -= 5;
    }
    while (days >= 1) {
        emotes.push("*star*");
        days -= 1;
    }

    return emotes;
};

export const replaceImageTags = (data: string): string => {
    const imgTagRegex = /<img src="([^"]+)">/g;
    return data.replace(imgTagRegex, (match, src) => {
        const fileName = src.substring(src.lastIndexOf("/") + 1, src.length);
        return getEmote(fileName);
    });
};

const extractUsername = (data: string): string => {
    const startIndex = 1;
    const endIndex = data.indexOf("<img");
    return data
        .slice(startIndex, endIndex !== -1 ? endIndex : undefined)
        .trim();
};

export const countDays = (data: string): UserDays => {
    const username = extractUsername(data);
    const imgTagRegex = /<img src="([^"]+)">/g;
    let days = 0;

    data.replace(imgTagRegex, (match, src) => {
        const fileName = src.substring(src.lastIndexOf("/") + 1);
        const emote = getEmote(fileName);
        days += emoteToDays(emote);
        return "";
    });

    return { user: username, days };
};

export const updateDaysByUsername = (
    usernames: string[],
    userDaysList: UserDays[]
): UserDays[] => {
    const updatedUserDaysList: UserDays[] = [];

    for (const userDays of userDaysList) {
        if (userDays.days > 0 || usernames.includes(userDays.user)) {
            updatedUserDaysList.push(userDays);
        }
    }

    for (const username of usernames) {
        const existingUserDays = updatedUserDaysList.find(
            (userDays) => userDays.user === username
        );
        if (existingUserDays) {
            existingUserDays.days += 1; // Increment days by 1
        } else {
            const newUserDays: UserDays = {
                user: username,
                days: 0, // Initialize days to 0 for new users
            };
            updatedUserDaysList.push(newUserDays);
        }
    }

    return updatedUserDaysList;
};

export const organizeUserDaysList = (userDaysList: UserDays[]): UserDays[] => {
    const sortedUserDaysList = [...userDaysList];
  
    // Sort by days in descending order
    sortedUserDaysList.sort((a, b) => {
      if (b.days !== a.days) {
        return b.days - a.days; // Sort by days in descending order
      } else {
        return a.user.localeCompare(b.user, undefined, { sensitivity: 'base' }); // Sort alphabetically within the same days
      }
    });
  
    return sortedUserDaysList;
  };

  export const formatUserDaysList = (userDaysList: UserDays[]): string => {
    let formattedString = '';
  
    for (let i = 0; i < userDaysList.length; i++) {
      const { user, days } = userDaysList[i];
      formattedString += `-${user} ${daysToEmotes(days).join('')}`;
  
      if (i < userDaysList.length - 1) {
        const nextUserDays = userDaysList[i + 1];
        if (nextUserDays.days !== days) {
          formattedString += '\n\n'; // Add two line breaks between groups
        } else {
          formattedString += '\n'; // Add one line break between users within a group
        }
      }
    }
  
    return formattedString;
  };