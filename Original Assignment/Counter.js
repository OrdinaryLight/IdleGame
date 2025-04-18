"use strict";

// CLASS: Counter
//
// Author: It was given code, I only added to it
//
// REMARKS: This class acts as counter, mainly being used to keep track of how many potatoes a user has and is producing.
//
//-----------------------------------------
class Counter {
    //
    //Instance variables
    //
    #count; //the current amount of potatoes held
    #name; //id of the counter in the html file
    #htmlCounter; //the html element representing the counter
    #htmlPPS; //the html element representing the pps
    #htmlMessage; //the html element for showing a message
    #htmlAchievement; //the html element for showing an achievement
    #rate; //the pps value
    #multiplier; //a pps multipler (1 by default)
    #bonusButtonList; //a list of all BonusButtons

    #timeSinceBonus; // time since a bonus has appeared in ms
    #totalCount; // total amount of potatoes made
    #nextAchievement; // amount of potatoes till the next achievement

    //
    //Class constants
    //
    static get #INTERVAL() {
        return 50;
    } //setting the interval to 50 milliseconds
    static get #SECOND_IN_MS() {
        return 1000;
    } //one second in milliseconds
    static get DEFAULT_MESSAGE_DURATION() {
        return 5;
    } //in seconds

    static get #TIME_BETWEEN_BONUS() {
        return 90 * Counter.#SECOND_IN_MS;
    } // in ms

    static get #ACHIEVEMENT_THRESHOLD() {
        return 10;
    } // amount needed more to get the next achievement

    //
    //Constructor
    //
    constructor(name, pps, messageBox, achievementBox) {
        this.#count = 0;
        this.#name = name;
        this.#htmlCounter = document.getElementById(name);
        this.#htmlPPS = document.getElementById(pps);
        this.#htmlMessage = document.getElementById(messageBox);
        this.#htmlAchievement = document.getElementById(achievementBox);
        this.#rate = 1;
        this.#multiplier = 1;
        this.#initCounter();
        this.#bonusButtonList = [];

        this.#timeSinceBonus = 0;
        this.#totalCount = 0;
        this.#nextAchievement = Counter.#ACHIEVEMENT_THRESHOLD;
    }

    //Top secret...
    cheatCode() {
        this.#count = 50000000;
    }

    //Method that regularly updates the counter and pps texts
    #updateCounter() {
        this.#htmlCounter.innerText = `Counter: ${Math.round(this.#count)} potatoes`; // Display the counter
        this.#htmlPPS.innerText = `Potatoes per second: ${this.#rate * this.#multiplier} pps`;

        // add to current count
        this.#count += (this.#rate * this.#multiplier * Counter.#INTERVAL) / Counter.#SECOND_IN_MS;

        // add to total count and show achievement
        this.#totalCount += (this.#rate * this.#multiplier * Counter.#INTERVAL) / Counter.#SECOND_IN_MS;
        if (this.#totalCount >= this.#nextAchievement) {
            this.showMessage("Congratulations! You made a total of " + this.#nextAchievement + " potatoes!", Counter.DEFAULT_MESSAGE_DURATION, true);
            this.#nextAchievement *= Counter.#ACHIEVEMENT_THRESHOLD;
        }

        // spawn bonus
        this.#timeSinceBonus += Counter.#INTERVAL;
        if (this.#timeSinceBonus >= Counter.#TIME_BETWEEN_BONUS) {
            this.#timeSinceBonus = 0;
            let bb = this.#bonusButtonList[Math.floor(Math.random() * this.#bonusButtonList.length)];
            bb.startBonus();
        }
    }

    //Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
    #initCounter() {
        setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
    }

    //Method that can be used to present a message:
    //either a regular message (when the achievement parameter is set to false) OR
    //an achievement message (when the achievement parameter is set to true).
    showMessage(
        theMessage,
        time = Counter.DEFAULT_MESSAGE_DURATION, //time is in seconds;
        achievement = false
    ) {
        let theElement = this.#htmlMessage;
        if (achievement) theElement = this.#htmlAchievement;
        theElement.innerHTML = theMessage;
        theElement.classList.remove("hidden");
        //The following statement will make theElement invisible again after [time] seconds
        setTimeout(() => {
            theElement.classList.add("hidden");
        }, time * Counter.#SECOND_IN_MS);
    }

    addBonusButton(bb) {
        if (arguments.length === 1 && bb instanceof BonusButton) {
            this.#bonusButtonList.push(bb);
        } else {
            throw new Error("Can't add bonus button when given parameter isn't a bonus button");
        }
    }

    preformBonus(multiplier, duration) {
        this.#multiplier *= multiplier;
        setTimeout(() => {
            this.#multiplier /= multiplier;
        }, duration * Counter.#SECOND_IN_MS);
    }

    addClick(clickAmount) {
        this.#count += clickAmount;
        this.#totalCount += clickAmount;
    }

    decreaseCount(amount) {
        this.#count -= amount;
    }

    increaseRate(amount) {
        this.#rate += amount;
    }

    get count() {
        return this.#count;
    }
}
