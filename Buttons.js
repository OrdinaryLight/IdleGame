"use strict";

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
            this.#htmlButton = button
            this.#htmlButton.addEventListener("click", this.clickAction.bind(this));
        } else if (arguments.length == 2) {
            this.#htmlButton = document.getElementById(name);
            this.#htmlButton.addEventListener("click", this.clickAction.bind(this));
        }
    }

    updateText(newText) {
        document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
    }

    //Abstract method to make subclasses implement a click actions method
    clickAction() {
        if (this.clickAction.name === "Button") {
            throw new Error("clickAction is abstract in class Button, unable to call method from a instance of Button");
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

class BonusButton extends Button {
    static get MESSAGE_DURATION() {
        return 5; // in seconds
    }

    constructor(name, counter, button) {
        if (constructor.name === "BonusButton") {
            throw new Error("BonusButton is an abstract class cannot create instance of it")
        }

        if (arguments.length == 3) {
            super(name, counter, button);
        } else if (arguments.length == 2) {
            super(name, counter);
        }

    }

    clickAction() {
        if (constructor.name === "BonusButton") {
            throw new Error("clickAction is abstract in class BonusButton, unable to call method from a instance of BonusButton")
        }
    }

    clone(clonedHtmlButton) {
        if (constructor.name === "BonusButton") {
            throw new Error("clone is abstract in class BonusButton, unable to call method from a instance of BonusButton")
        }
    }

    //------------------------------------------------------
    // startBonus
    //
    // PURPOSE:    makes a button visable for a period of time then hides it if not already hidden
    //------------------------------------------------------
    startBonus() {
        let clonedElement = this.htmlButton.cloneNode(true);
        clonedElement.id = this.name + "-" + Date.now();

        const tempButton = this.clone(clonedElement);

        clonedElement.style.left = Math.floor(10 + Math.random() * 80) + "%"; // 80 so that nothing clips out of screen
        clonedElement.style.top = Math.floor(10 + Math.random() * 80) + "%"; // range from 10-90% main screen
        clonedElement.classList.remove("hidden");
        document.querySelector(".main-game-area").appendChild(clonedElement);

        setTimeout(() => {
            if (document.body.contains(clonedElement)) {
                clonedElement.remove();
            }
        }, this.duration * Counter.SECOND_IN_MS);
    }

}

class MultiplicativeBonusButton extends BonusButton {
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
        this.htmlButton.remove()
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
        return new MultiplicativeBonusButton(this.name, this.counter, this.#multiplier, this.#duration, clonedHtmlButton);
    }

    get multiplier() {
        return this.#multiplier;
    }

    get duration() {
        return this.#duration;
    }


}

class AdditiveBonusButton extends BonusButton {

}


class BonusButtonStorm extends Button {
    #AdditiveButton
    constructor(name, counter, button) {
        super(name, counter);
    }

    clickAction() {
        // get random amount of them then for that many call start bonus. make bonus more up in hierchy and make normal bonus button a class or smoehitibskld lbjkh;j
    }
}

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
}

class CostButton extends Button {
    #price;
    #priceIncrease;
    #numBought;

    static get #TWO_DECIMAL_ROUNDING() {
        return 100;
    }

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

class PotatoButton extends CostButton {
    #bonusButton;

    constructor(name, counter, price, bb, priceMultiplier) {
        super(name, counter, price, priceMultiplier);
        this.#bonusButton = bb;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.updateText(this.name + "<br>Cost: " + this.price + "<br>Prod: " + this.#bonusButton.multiplier + "x for " + this.#bonusButton.duration + "s");
            this.#bonusButton.startBonus();
        }
    }
}

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

    get improvement() {
        return this.#improvement;
    }


}

class ClickerUpgradeButton extends UpgradeButton {
    #clicker

    constructor(name, counter, price, improvement, clicker, priceMultiplier) {
        super(name, counter, price, improvement, priceMultiplier);
        this.#clicker = clicker;
    }

    clickAction() {
        if (this.canPurchase()) {
            this.purchase();
            this.#clicker.increaseClick(this.improvement);
            this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>Click adds +" + this.improvement);

        }
    }
}

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
            this.updateText(this.numBought + " " + this.name + "<br>Cost: " + this.price + "<br>" + this.#building.name + " prod. x " + this.improvement);
        }
    }
}
