export const WelcomeMessage = () => {
    
    const listOfTitles = [
        "Let's get back to guessing...",
        "Can you hunt down the location like a true panther?",
        "Paws up!",
        "Do you know your campus as well as you think?"
    ]

    function getRandomTitle()  {
        // get a random title from the list and return
        return listOfTitles[Math.floor(Math.random() * listOfTitles.length)];
    }

    return (
        getRandomTitle()
    )

}