"use strict";

/*
In general all classes have a constructor, a clone method and a clickAction method. 
these do different things in different class but clickAction is usually called when a button is clicked.
clone is called when a button needs to be copied. sometimes it takes a parameter that is a copy of the htmlButton
*/

// Button base class
class Button {
    #name;
    #counter;
    #htmlButton;

    static get TEXT_ATTRIBUTE() {
        return "-text";
    }

    constructor(name, counter, button) {
        if (this.constructor.name === "Button") {
            throw new Error("Button is an abstract class, cannot create instance of this class");
        }

        this.#name = name;
        this.#counter = counter;

        if (arguments.length == 3) {
            this.#htmlButton = button;
        } else if (arguments.length == 2) {
            this.#htmlButton = document.getElementById(name);
        }

        const container = this.#htmlButton.closest(".image-button-container");
        if (container) {
            container.addEventListener("click", this.clickAction.bind(this));
        } else {
            this.#htmlButton.addEventListener("click", this.clickAction.bind(this));
        }
    }

    // general text update for buttons
    updateText(newText) {
        document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
    }

    //Abstract method to make subclasses implement a click actions method
    clickAction() {
        if (this.clickAction.name === "Button") {
            throw new Error("clickAction is abstract in class Button, unable to call method from a instance of Button");
        }
    }

    clone() {
        if (this.clone.name === "Button") {
            throw new Error("clone is abstract in class Button, unable to call method from a instance of Button");
        }
    }

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

// BonusButton base class
class BonusButton extends Button {
    static get MESSAGE_DURATION() {
        return 5; // in seconds
    }

    static get ONSCREEN_DURATION() {
        return 15; // in seconds
    }

    constructor(name, counter, button) {
        if (constructor.name === "BonusButton") {
            throw new Error("BonusButton is an abstract class cannot create instance of it");
        }

        if (arguments.length == 3) {
            super(name, counter, button);
        } else if (arguments.length == 2) {
            super(name, counter);
        }
    }

    clickAction() {
        if (this.clickAction.name === "BonusButton") {
            throw new Error("clickAction is abstract in class BonusButton, unable to call method from a instance of BonusButton");
        }
    }

    clone() {
        if (this.clone.name === "BonusButton") {
            throw new Error("clone is abstract in class BonusButton, unable to call method from a instance of BonusButton");
        }
    }

    //makes a new button visible for a period of time then hides it if not already hidden
    startBonus() {
        let clonedElement = this.htmlButton.cloneNode(true);
        clonedElement.id = this.name + "-" + Date.now();

        const tempButton = this.clone(clonedElement);

        clonedElement.style.left = Math.floor(15 + Math.random() * 70) + "%"; // 70 so that nothing clips out of screen
        clonedElement.style.top = Math.floor(15 + Math.random() * 70) + "%"; // range from 15-85% main screen
        clonedElement.classList.remove("hidden");
        document.querySelector(".main-game-area").appendChild(clonedElement);

        setTimeout(() => {
            if (document.body.contains(clonedElement)) {
                clonedElement.remove();
            }
        }, BonusButton.ONSCREEN_DURATION * Counter.SECOND_IN_MS);
    }
}

// bonus button that when clicked, multiplies pps for a duration
class MultiplicativeBonus extends BonusButton {
    #multiplier;
    #duration;

    constructor(name, counter, multiplier, duration, button) {
        if (arguments.length == 5) {
            super(name, counter, button);
        } else if (arguments.length == 4) {
            super(name, counter);
        }
        this.#multiplier = multiplier;
        this.#duration = duration; // in seconds
    }

    clickAction() {
        this.htmlButton.remove();
        this.preformBonus();
    }

    preformBonus() {
        this.counter.showMessage(this.name + "started! <br>" + this.#multiplier + " x pps for " + this.#duration + " seconds!", BonusButton.MESSAGE_DURATION, false);
        this.counter.multiplier = this.#multiplier;
        setTimeout(() => {
            this.counter.multiplier = 1 / this.#multiplier;
        }, this.#duration * Counter.SECOND_IN_MS);
    }

    clone(clonedHtmlButton) {
        return new MultiplicativeBonus(this.name, this.counter, this.#multiplier, this.#duration, clonedHtmlButton);
    }

    get multiplier() {
        return this.#multiplier;
    }

    get duration() {
        return this.#duration;
    }
}

// bonus button that when clicked, multiplies amount gained for clicks for a duration
class MultiplicativeClickerBonus extends BonusButton {
    #multiplier;
    #duration;

    constructor(name, counter, multiplier, duration, button) {
        if (arguments.length == 5) {
            super(name, counter, button);
        } else {
            super(name, counter);
        }
        this.#multiplier = multiplier;
        this.#duration = duration; // in seconds
    }

    clickAction() {
        this.htmlButton.remove();
        this.preformBonus();
    }

    preformBonus() {
        this.counter.showMessage(this.name + "started! <br>" + this.#multiplier + " x pps for " + this.#duration + " seconds!", BonusButton.MESSAGE_DURATION, false);
        this.counter.clickMultiplier = this.#multiplier;
        setTimeout(() => {
            this.counter.clickMultiplier = 1 / this.#multiplier;
        }, this.#duration * Counter.SECOND_IN_MS);
    }

    clone(clonedHtmlButton) {
        return new MultiplicativeClickerBonus(this.name, this.counter, this.#multiplier, this.#duration, clonedHtmlButton);
    }

    get multiplier() {
        return this.#multiplier;
    }

    get duration() {
        return this.#duration;
    }
}

// bonus button that when clicked, adds an amount of potatoes
class AdditiveBonus extends BonusButton {
    #lowerBound;
    #upperBound;
    #basedOnPps;

    static get #MESSAGE_TIME() {
        return 1.5;
    }

    constructor(name, counter, lowerBound, upperBound, basedOnPps, button) {
        if (arguments.length == 6) {
            super(name, counter, button);
        } else if (arguments.length == 5) {
            super(name, counter);
        }
        this.#basedOnPps = basedOnPps;
        this.#lowerBound = lowerBound;
        this.#upperBound = upperBound;
    }

    clickAction() {
        this.htmlButton.remove();
        this.preformBonus();
    }

    preformBonus() {
        const percent = this.#getPercent(this.#lowerBound, this.#upperBound);
        let am = 0;
        if (this.#basedOnPps) {
            am = percent * this.counter.pps;
        } else {
            am = percent * this.counter.count;
        }
        this.counter.clickMessage(am, AdditiveBonus.#MESSAGE_TIME);
        this.counter.addClick(am); // scales with click multiplier (thought it'd be cool)
    }

    clone(clonedHtmlButton) {
        return new AdditiveBonus(this.name, this.counter, this.#lowerBound, this.#upperBound, this.#basedOnPps, clonedHtmlButton);
    }

    #getPercent(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) / 100;
    }
}

// bonus button that when clicked spawns a random amount of a certain type of bonus button
class BonusStorm extends BonusButton {
    #additiveBonus;
    #lowerBound;
    #upperBound;

    constructor(name, counter, additiveBonus, lowerBound, upperBound, button) {
        if (arguments.length == 6) {
            super(name, counter, button);
        } else {
            super(name, counter);
        }
        this.#additiveBonus = additiveBonus;
        this.#lowerBound = lowerBound;
        this.#upperBound = upperBound;
    }

    clickAction() {
        this.htmlButton.remove();
        this.preformBonus();
        this.counter.showMessage(this.name + " clicked", BonusButton.MESSAGE_DURATION, false);
    }

    preformBonus() {
        let amount = this.#getAmount(this.#lowerBound, this.#upperBound);
        for (let i = 1; i < amount; i++) {
            this.#additiveBonus.startBonus();
        }
    }

    clone(clonedHtmlButton) {
        return new BonusStorm(this.name, this.counter, this.#additiveBonus, this.#lowerBound, this.#upperBound, clonedHtmlButton);
    }

    #getAmount(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
}

// this is the button you click to gain potatoes
class ClickingButton extends Button {
    #clickAmount;

    static get #MESSAGE_TIME() {
        return 0.5;
    }

    constructor(name, counter, amount) {
        super(name, counter);
        if (arguments.length === 2) {
            this.#clickAmount = 1;
        } else if (arguments.length === 3) {
            this.#clickAmount = amount;
        }
    }

    increaseClick(amount) {
        this.#clickAmount += amount;
        this.counter.clickAmount = this.#clickAmount;
    }

    clickAction() {
        this.counter.addClick(this.#clickAmount);
        this.counter.clickMessage(this.#clickAmount, ClickingButton.#MESSAGE_TIME);
    }

    clone(clonedHtmlButton) {
        return new ClickingButton(this.name, this.counter, this.#clickAmount, clonedHtmlButton);
    }
}

// A base class for any button associated with a cost that increases upon purchase
class CostButton extends Button {
    #price;
    #priceIncrease;
    #numBought;
    #initialPrice;

    constructor(name, counter, price, priceIncrease) {
        super(name, counter);
        if (this.constructor.name === "CostButton") {
            throw new Error("CostButton is an abstract class, cannot create instance of this class");
        }
        this.#price = price;
        this.#priceIncrease = priceIncrease;
        this.#numBought = 0;
        this.#initialPrice = price;
    }

    clickAction() {
        if (this.clickAction.name === "CostButton") {
            throw new Error("clickAction is abstract in class CostButton, unable to call method from a instance of CostButton");
        }
    }

    clone() {
        if (this.clone.name === "CostButton") {
            throw new Error("clone is abstract in class CostButton, unable to call method from a instance of CostButton");
        }
    }

    showInfo() {
        if (this.showInfo.name === "CostButton") {
            throw new Error("showInfo is abstract in class CostButton, unable to call method from a instance of CostButton");
        }
    }

    canPurchase() {
        return this.counter.count >= this.#price;
    }

    purchase() {
        if (this.canPurchase()) {
            this.counter.decreaseCount(this.#price);
            this.increasePrice();
            this.#numBought += 1;
        }
    }

    increasePrice() {
        this.#price *= this.#priceIncrease;
    }

    resetPrice() {
        this.#price = this.#initialPrice;
        this.showInfo();
    }

    get price() {
        return Math.round(this.#price * 100) / 100; // rounds prices To 2 digits
    }

    get priceIncrease() {
        return this.#priceIncrease;
    }

    get numBought() {
        return this.#numBought;
    }
}

// Button that resets a given list of CostButtons to their original price
class TimeMachineButton extends CostButton {
    #bonusList;

    constructor(name, counter, price, priceIncrease, bonusList) {
        super(name, counter, price, priceIncrease);
        this.#bonusList = bonusList;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.showInfo();
            for (let i = 0; i < this.#bonusList.length; i++) {
                this.#bonusList[i].resetPrice();
            }
        }
    }

    clone() {
        return new TimeMachineButton(this.name, this.counter, this.price, this.priceIncrease);
    }

    showInfo() {
        this.updateText(this.name + ": Resets cost of all bonus potato buttons<br>Cost: " + this.price);
    }
}

// base class that acts as a purchasable bonus button
class PotatoButton extends CostButton {
    #bonusButton;

    constructor(name, counter, price, bb, priceMultiplier) {
        if (constructor.name === "PotatoButton") {
            throw new Error("PotatoButton is an abstract class cannot create instance of it");
        }
        super(name, counter, price, priceMultiplier);
        this.#bonusButton = bb;
    }

    clickAction() {
        if (this.clickAction.name === "PotatoButton") {
            throw new Error("clickAction is abstract in class PotatoButton, unable to call method from a instance of PotatoButton");
        }
    }

    clone() {
        if (this.clone.name === "PotatoButton") {
            throw new Error("clone is abstract in class PotatoButton, unable to call method from a instance of PotatoButton");
        }
    }

    showInfo() {
        if (this.showInfo.name === "PotatoButton") {
            throw new Error("showInfo is abstract in class PotatoButton, unable to call method from a instance of PotatoButton");
        }
    }

    get bonusButton() {
        return this.#bonusButton;
    }
}

// a puchasable button that spawns a multiplicative bonus button for your pps
class PPSBonusButton extends PotatoButton {
    constructor(name, counter, price, bb, priceMultiplier) {
        super(name, counter, price, bb, priceMultiplier);
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.showInfo();
            this.bonusButton.startBonus();
        }
    }

    clone() {
        return new PPSBonusButton(this.name, this.counter, this.price, this.bonusButton, this.priceIncrease);
    }

    showInfo() {
        this.updateText(this.name + "<br>Cost: " + this.price + "<br>Prod: " + this.bonusButton.multiplier + "x for " + this.bonusButton.duration + "s");
    }
}

// a puchasable button that spawns a multiplicative bonus button for your clicks
class ClickerBonusButton extends PotatoButton {
    constructor(name, counter, price, bb, priceMultiplier) {
        super(name, counter, price, bb, priceMultiplier);
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.showInfo();
            this.bonusButton.startBonus();
        }
    }

    clone() {
        return new ClickerBonusButton(this.name, this.counter, this.price, this.bonusButton, this.priceIncrease);
    }

    showInfo() {
        this.updateText(this.name + "<br>Cost: " + this.price + "<br>Click : " + this.bonusButton.multiplier + "x for " + this.bonusButton.duration + "s");
    }
}

// a puchasable button that spawns a potato storm bonus button
class PotatoStormBonusButton extends PotatoButton {
    constructor(name, counter, price, bb, priceMultiplier) {
        super(name, counter, price, bb, priceMultiplier);
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.showInfo();
            this.bonusButton.startBonus();
        }
    }

    clone() {
        return new PotatoStormBonusButton(this.name, this.counter, this.price, this.bonusButton, this.priceIncrease);
    }

    showInfo() {
        this.updateText(this.name + "<br>Cost: " + this.price + "<br>Spawns " + this.bonusButton.name);
    }
}
// a purchasable button that gives you more pps
class BuildingButton extends CostButton {
    #rateIncrease;

    static get #PRICE_MULTIPLIER() {
        return 1.5;
    }

    constructor(name, counter, price, rateIncrease) {
        super(name, counter, price, BuildingButton.#PRICE_MULTIPLIER);
        this.#rateIncrease = rateIncrease;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.counter.increaseRate(this.#rateIncrease);
            this.showInfo();
        }
    }

    clone() {
        return new BuildingButton(this.name, this.counter, this.price, this.#rateIncrease);
    }

    showInfo() {
        this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Adds: " + this.#rateIncrease + " pps");
    }

    multiplyRate(multiplier) {
        this.#rateIncrease *= multiplier;
        this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Adds: " + this.#rateIncrease + " pps");
    }

    get rateIncrease() {
        return this.#rateIncrease;
    }
}

// a base class that acts as a purchasable button that will improve something else
class UpgradeButton extends CostButton {
    #improvement;

    constructor(name, counter, price, improvement, priceMultiplier) {
        super(name, counter, price, priceMultiplier);

        if (this.constructor.name === "UpgradeButton") {
            throw new Error("UpgradeButton is an abstract class");
        }

        this.#improvement = improvement;
    }

    clickAction() {
        if (this.clickAction.name === "UpgradeButton") {
            throw new Error("UpgradeButton is an abstract class");
        }
    }

    clone() {
        if (this.clone.name === "UpgradeButton") {
            throw new Error("UpgradeButton is an abstract class");
        }
    }

    get improvement() {
        return this.#improvement;
    }
}

// a purchasable button that makes your click give more potatoes
class ClickerUpgradeButton extends UpgradeButton {
    #clicker;

    constructor(name, counter, price, improvement, clicker, priceMultiplier) {
        super(name, counter, price, improvement, priceMultiplier);
        this.#clicker = clicker;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.#clicker.increaseClick(this.improvement);
            this.showInfo();
        }
    }

    clone() {
        return new ClickerUpgradeButton(this.name, this.counter, this.price, this.improvement, this.#clicker, this.priceIncrease);
    }

    showInfo() {
        this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Click adds +" + this.improvement);
    }
}
// a purchasable button that makes a building give you more pps
class BuildingUpgradeButton extends UpgradeButton {
    #building;

    static get #priceMultiplier() {
        return 5;
    }

    constructor(name, counter, price, improvementMultiplier, building) {
        super(name, counter, price, improvementMultiplier, BuildingUpgradeButton.#priceMultiplier);
        this.#building = building;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.counter.increaseRate(this.#building.numBought * this.#building.rateIncrease * (this.improvement - 1));
            this.#building.multiplyRate(this.improvement);
            this.showInfo();
        }
    }

    clone() {
        return new BuildingUpgradeButton(this.name, this.counter, this.improvement, this.#building);
    }

    showInfo() {
        this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>" + this.#building.name + " prod. x " + this.improvement);
    }
}
