"use strict";

// CLASS: Button
//
// Author: It was given code, I only added to it
//
// REMARKS: This class is a button
//
//-----------------------------------------
class Button {
    //
    //Instance variables
    //
    #name;
    #counter;
    #htmlButton;

    //
    //Class constants
    //
    static get TEXT_ATTRIBUTE() {
        return "-text";
    }

    //
    //Constructor
    //
    constructor(name, counter) {
        if (this.constructor.name === "Button") {
            throw new Error("Button is an abstract class, cannot create instance of this class");
        }

        this.#name = name;
        this.#counter = counter;
        this.#htmlButton = document.getElementById(name);
        // Add a click event listener to the button
        this.#htmlButton.addEventListener("click", this.clickAction.bind(this)); //this has a different meaning in this context, so I need to bind my method to it
    }

    //Updating the innerHTML text of the button
    //(note that not all types of buttons have text, but I placed this here to give that code to you)
    updateText(newText) {
        document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
    }

    //Abstract method to make subclasses implement a click actions method
    clickAction() {
        if (this.clickAction.name === "Button") {
            throw new Error("clickAction is abstract in class Button, unable to call method from a instance of Button");
        }
    }

    //
    //Accessors below that you might find useful
    //
    get name() {
        return this.#name;
    }

    get counter() {
        return this.#counter;
    }

    get htmlButton() {
        return this.#htmlButton;
    }
}

// CLASS: BonusButton
//
// Author: Adam Lewicki, 7994491
//
// REMARKS: This class acts as a button that gives a bonus and disappears when clicked
//
//-----------------------------------------
class BonusButton extends Button {
    #multiplier;
    #duration;

    static get #MESSAGE_DURATION() {
        return 5; // in seconds
    }

    static get #SECOND_IN_MS() {
        return 1000;
    }

    //
    //Constructor
    //
    constructor(name, counter, multiplier, duration) {
        super(name, counter);
        this.#multiplier = multiplier;
        this.#duration = duration; // in seconds
    }

    clickAction() {
        this.counter.showMessage(this.name + "started! <br>" + this.#multiplier + " x pps for " + this.#duration + " seconds!", BonusButton.#MESSAGE_DURATION, false);
        this.htmlButton.classList.add("hidden");
        this.counter.preformBonus(this.#multiplier, this.#duration);
    }

    //------------------------------------------------------
    // startBonus
    //
    // PURPOSE:    makes a button visable for a period of time then hides it if not already hidden
    //------------------------------------------------------
    startBonus() {
        this.htmlButton.classList.remove("hidden");
        setTimeout(() => {
            if (!this.htmlButton.classList.contains("hidden")) {
                this.htmlButton.classList.add("hidden");
            }
        }, this.#duration * BonusButton.#SECOND_IN_MS);
    }

    get multiplier() {
        return this.#multiplier;
    }

    get duration() {
        return this.#duration;
    }
}

// CLASS: ClickingButton
//
// Author: Adam Lewicki, 7994491
//
// REMARKS: This class acts as a button that preforms an action when clicked (adds 1 potato to count here)
//
//-----------------------------------------
class ClickingButton extends Button {
    #clickAmount;

    static get #MESSAGE_TIME() {
        return 0.1;
    }

    //
    //Constructor
    //
    constructor(name, counter, amount) {
        super(name, counter);
        if (arguments.length === 2) {
            this.#clickAmount = 1;
        } else if (arguments.length === 3) {
            this.#clickAmount = amount;
        }
    }

    clickAction() {
        this.counter.addClick(this.#clickAmount);
        this.counter.showMessage("+" + this.#clickAmount, ClickingButton.#MESSAGE_TIME, false);
    }
}

// CLASS: CostButton
//
// Author: Adam Lewicki, 7994491
//
// REMARKS: This class acts as a button that has a cost and when clicked increases its cost and the number of it bought
//
//-----------------------------------------
class CostButton extends Button {
    #price;
    #priceIncrease;
    #numBought;

    static get #TWO_DECIMAL_ROUNDING() {
        return 100;
    }

    //
    //Constructor
    //
    constructor(name, counter, price, priceIncrease) {
        super(name, counter);
        if (this.constructor.name === "CostButton") {
            throw new Error("CostButton is an abstract class, cannot create instance of this class");
        }
        this.#price = price;
        this.#priceIncrease = priceIncrease;
        this.#numBought = 0;
    }

    clickAction() {
        if (this.clickAction.name === "CostButton") {
            throw new Error("clickAction is abstract in class CostButton, unable to call method from a instance of CostButton");
        }
    }

    canPurchase() {
        return this.counter.count >= this.#price;
    }

    purchase() {
        if (this.canPurchase()) {
            this.counter.decreaseCount(this.#price);
            this.increasePrice();
        }
        this.#numBought += 1;
    }

    increasePrice() {
        this.#price *= this.#priceIncrease;
    }

    get price() {
        return Math.round(this.#price * CostButton.#TWO_DECIMAL_ROUNDING) / CostButton.#TWO_DECIMAL_ROUNDING;
    }

    get numBought() {
        return this.#numBought;
    }
}

// CLASS: BuildingButton
//
// Author: Adam Lewicki, 7994491
//
// REMARKS: this class acts as a building that can be purchased to produce potatoes
//
//-----------------------------------------
class BuildingButton extends CostButton {
    #rateIncrease;

    static get #PRICE_MULTIPLIER() {
        return 1.5;
    }

    //
    //Constructor
    //
    constructor(name, counter, price, rateIncrease) {
        super(name, counter, price, BuildingButton.#PRICE_MULTIPLIER);
        this.#rateIncrease = rateIncrease;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.counter.increaseRate(this.#rateIncrease);
            this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Adds: " + this.#rateIncrease + " pps");
        }
    }

    multiplyRate(multiplier) {
        this.#rateIncrease *= multiplier;
        this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Adds: " + this.#rateIncrease + " pps");
    }

    get rateIncrease() {
        return this.#rateIncrease;
    }
}

// CLASS: UpgradeButton
//
// Author: Adam Lewicki, 7994491
//
// REMARKS: This class acts as a button that upgrades a building.
//
//-----------------------------------------
class UpgradeButton extends CostButton {
    #building;
    #improvementMultiplier;

    static get #PRICE_MULTIPLIER() {
        return 5;
    }

    //
    //Constructor
    //
    constructor(name, counter, price, improvementMultiplier, building) {
        super(name, counter, price, UpgradeButton.#PRICE_MULTIPLIER);
        this.#building = building;
        this.#improvementMultiplier = improvementMultiplier;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.#building.multiplyRate(this.#improvementMultiplier);
            this.counter.increaseRate(this.#building.numBought * (this.#building.rateIncrease - 1));
            this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>" + this.#building.name + " prod. x " + this.#improvementMultiplier);
        }
    }
}
