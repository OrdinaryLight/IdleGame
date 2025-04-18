"use strict";

//
class Counter {
    #count; //the current amount of potatoes held
    #name; //id of the counter in the html file
    #htmlCounter; //the html element representing the counter
    #htmlPPS; //the html element representing the pps
    #htmlMessage; //the html element for showing a message
    #htmlClick; // the html element for showing a click
    #htmlAchievement; //the html element for showing an achievement
    #rate; //the pps value
    #multiplier; //a pps multipler (1 by default)
    #bonusButtonList; //a list of all BonusButtons
    #timeSinceBonus; // time since a bonus has appeared in ms
    #totalCount; // total amount of potatoes made
    #nextAchievement; // amount of potatoes till the next achievement
    #htmlClickAmount; // the html element representing how much a click gives
    #clickAmount; // amount a click gives
    #clickMultiplier; // a click multiplier (1 by default)

    //
    //Class constants
    //
    static get #INTERVAL() {
        return 50;
    } //setting the interval to 50 milliseconds
    static get SECOND_IN_MS() {
        return 1000;
    } //one second in milliseconds
    static get DEFAULT_MESSAGE_DURATION() {
        return 5;
    } //in seconds

    static get #TIME_BETWEEN_BONUS() {
        return 45 * Counter.SECOND_IN_MS;
    } // in ms

    static get #ACHIEVEMENT_THRESHOLD() {
        return 10;
    } // amount needed more to get the next achievement

    //
    //Constructor
    //
    constructor(name, pps, messageBox, achievementBox, clickBox, clickAmount) {
        this.#count = 0;
        this.#name = name;
        this.#htmlCounter = document.getElementById(name);
        this.#htmlPPS = document.getElementById(pps);
        this.#htmlMessage = document.getElementById(messageBox);
        this.#htmlAchievement = document.getElementById(achievementBox);
        this.#htmlClick = document.getElementById(clickBox);
        this.#rate = 1;
        this.#multiplier = 1;
        this.#initCounter();
        this.#bonusButtonList = [];
        this.#timeSinceBonus = 0;
        this.#totalCount = 0;
        this.#nextAchievement = Counter.#ACHIEVEMENT_THRESHOLD;
        this.#htmlClickAmount = document.getElementById(clickAmount);
        this.#clickAmount = 1;
        this.#clickMultiplier = 1;
    }

    cheatCode() {
        this.#count = 50000000;
    }

    //Method that regularly updates the counter and pps texts
    #updateCounter() {
        this.#htmlCounter.innerText = `Counter: ${Math.round(this.#count)} potatoes`; // Display the counter
        this.#htmlPPS.innerText = `Potatoes per second: ${this.#rate * this.#multiplier} pps`;
        this.#htmlClickAmount.innerText = `Click amount: ${this.#clickAmount} ppc`;

        // add to current count
        this.#count += (this.#rate * this.#multiplier * Counter.#INTERVAL) / Counter.SECOND_IN_MS;

        // add to total count and show achievement
        this.#totalCount += (this.#rate * this.#multiplier * Counter.#INTERVAL) / Counter.SECOND_IN_MS;
        if (this.#totalCount >= this.#nextAchievement) {
            this.showMessage("Congratulations! You made a total of " + this.#nextAchievement + " potatoes!", Counter.DEFAULT_MESSAGE_DURATION, true);
            this.#nextAchievement *= Counter.#ACHIEVEMENT_THRESHOLD;
        }

        // spawn bonus
        this.#timeSinceBonus += Counter.#INTERVAL;
        if (this.#timeSinceBonus >= Counter.#TIME_BETWEEN_BONUS) {
            this.#timeSinceBonus = 0;
            this.spawnPotato();
        }
    }

    //Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
    #initCounter() {
        setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
    }

    // to show regular messages or achievement messages
    showMessage(
        theMessage,
        time = Counter.DEFAULT_MESSAGE_DURATION, //time is in seconds;
        achievement = false
    ) {
        let theElement = this.#htmlMessage;
        if (achievement) {
            theElement = this.#htmlAchievement;
        }

        theElement.innerHTML = theMessage;
        theElement.classList.remove("hidden");
        setTimeout(() => {
            theElement.classList.add("hidden");
        }, time * Counter.SECOND_IN_MS);
    }

    // to show click messages
    clickMessage(amount, time /* time in seconds*/) {
        let clonedElement = this.#htmlClick.cloneNode(true);
        clonedElement.innerHTML = "+" + amount * this.#clickMultiplier;

        document.querySelector(".main-game-area").appendChild(clonedElement);
        clonedElement.classList.remove("hidden");
        setTimeout(() => {
            if (document.body.contains(clonedElement)) {
                clonedElement.remove();
            }
        }, time * Counter.SECOND_IN_MS);
    }

    addBonusButton(bb) {
        this.#bonusButtonList.push(bb);
    }

    // adds an amount of potatoes to the count
    addClick(clickAmount) {
        this.#count += this.#clickMultiplier * clickAmount;
        this.#totalCount += this.#clickMultiplier * clickAmount;
    }

    decreaseCount(amount) {
        this.#count -= amount;
    }

    increaseRate(amount) {
        this.#rate += amount;
    }

    // spawns a random bonus potato
    spawnPotato() {
        let originalButton = this.#bonusButtonList[Math.floor(Math.random() * this.#bonusButtonList.length)];
        originalButton.startBonus();
    }

    get count() {
        return this.#count;
    }

    get pps() {
        return this.#rate * this.#multiplier;
    }

    get bonuses() {
        return this.#bonusButtonList;
    }

    /**
     * @param {number} amount
     */
    // sets how much a click is worth
    set clickAmount(amount) {
        this.#clickAmount = amount;
    }

    /**
     * @param {number} multiplier
     */
    // multipliers the current multiplier
    set multiplier(multiplier) {
        this.#multiplier *= multiplier;
    }

    /**
     * @param {number} multiplier
     */
    // multiplies the current click multipler
    set clickMultiplier(multiplier) {
        this.#clickMultiplier *= multiplier;
    }
}
