export const WelcomeMessage = () => {

    const listOfTitles = [
        "Let's get back to guessing...",
        "Are you a true panther at heart?",
        "Do you know your campus as well as you think?",
        "Time to put your navigation to the test...",
        "Can you find your way around Chapman?",
        "Test your campus knowledge here..."
    ]

    function getRandomTitle()  {
        // get a random title from the list and return
        return listOfTitles[Math.floor(Math.random() * listOfTitles.length)];
    }

    return (
        getRandomTitle()
    )

}