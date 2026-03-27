export function handleErrorMessages(ErrorCode: number | string | null){
    if(ErrorCode == 400){
        return {
            title: "API says 'Nope!'", 
            bodyText: "The backend API returned a 400. Looks like it didn’t understand our message.", 
            warning: false, 
            buttonText: "Try Again"
        }
    }
    else if (ErrorCode === 401) {
        return {
            title: "Unauthorized",
            bodyText: "The API key waved us off. Either it’s invalid or it forgot its password. Time to double-check!",
            warning: false,
            buttonText: "Check Key"
        }
    } 
    else if (ErrorCode === 403) {
        return {
            title: "Forbidden",
            bodyText: "Our API key tried to sneak in but got blocked. Upgrade required or access denied!",
            warning: false,
            buttonText: "Upgrade Plan"
        }
    } 
    else if (ErrorCode === 404) {
        return {
            title: "Not Found",
            bodyText: "The requested data is hiding somewhere in cyberspace… maybe loosen the parameters a bit?",
            warning: false,
            buttonText: "Retry"
        };
    } 
    else if (ErrorCode === 414) {
        return {
            title: "Too Long!",
            bodyText: "Your input array is a bit too ambitious. Shorten it and try again.",
            warning: false,
            buttonText: "Trim Input"
        };
    } 
    else if (ErrorCode === 429) {
        return {
            title: "Slow down!",
            bodyText: "The API request limit has been hit (either per minute or per day). Try again in a bit or come back tomorrow!",
            warning: false,
            buttonText: "Wait & Retry"
        };
    } 
    else if (ErrorCode === 500) {
        return {
            title: "Server Oops",
            bodyText: "The backend had an internal hiccup. Try again in a moment.",
            warning: false,
            buttonText: "Retry"
        };
    } 
    else if (ErrorCode === 1001) {
        return {
            title: "Hmm… couldn’t find that stock.",
            bodyText: "Please double-check that the symbol you entered is correct.",
            warning: false,
            buttonText: "Retry"
        };
    } 
    else {
        return {
            title: "Unknown API Error",
            bodyText: `The API returned an unexpected error code: ${ErrorCode}`,
            warning: false,
            buttonText: "Try Again"
        };
    }
}