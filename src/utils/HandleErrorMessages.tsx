// just had an idea, I could use an object to map error codes to messages instead of a long if/else chain. But this works for now, so I'll stick with it for the time being.

export function handleErrorMessages(ErrorCode: number | string | null){
    if(ErrorCode === 400){
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
    else if (ErrorCode === 1000){
        return {
            title: "You don't seem to be logged in",
            bodyText: "Double check you are logged in before completing any actions",
            warning: false,
            buttonText: "Back to Reality"
        }
    }
    else if (ErrorCode === 1001) {
        return {
            title: "Hmm… couldn’t find that stock.",
            bodyText: "Please double-check that the symbol you entered is correct.",
            warning: false,
            buttonText: "Retry"
        };
    }
    else if (ErrorCode === 1002) {
        return {
            title: "Very Funny... that's not a quantity!",
            bodyText: "Please enter a valid quantity.",
            warning: true,
            buttonText: "Retry"
        };
    }
    else if (ErrorCode === 1499){
        return {
            title: "Quantity Is Out Of This World",
            bodyText: "Our System wasn't able to process the quantity...",
            warning: true,
            buttonText: "Retry"
        }
    }    
    else if (ErrorCode === 1500){
        return {
            title: "Where did it go?",
            bodyText: "This Stock's Price Seems To Have Been Lost...",
            warning: false,
            buttonText: "Retry"
        }
    }    
    else if (ErrorCode === 1501){
        return {
            title: "Zero Stocks, Zero Problems",
            bodyText: "Investing in nothing is technically risk-free, but also profit-free",
            warning: true,
            buttonText: "Got it"
        }
    }
    else if (ErrorCode === 1502){
        return {
            title: "Mirror Trading Attempt",
            bodyText: "You’ve invented mirror trading. Unfortunately, we only support normal trading here.",
            warning: false,
            buttonText: "Okay Fine..."
        }
    }     
    else if (ErrorCode === 1503){
        return {
            title: "Wolf of Sim Street",
            bodyText: "That's not a bit much, let's take it down a notch",
            warning: false,
            buttonText: "Back to Reality"
        }
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