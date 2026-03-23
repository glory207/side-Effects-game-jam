import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";

class UImannager {
    constructor(gl) {
        this.hover = false;
        this.click = false;
        this.type = {name:"UI", children:true}
        this.children = [];
        this.popup = null;
        this.children.push(this.popup);
        var ui;
        ui = new inventoryUI(gl, [(0 - 2) * 0.7 * 2, -3.783, 0]);
        ui.obj.textOff[0] = 1;
        this.children.push(ui);
        for (let i = 1; i < 5; i++) {
            ui = new inventoryUI(gl, [(i - 2) * 0.7 * 2, -3.783, 0]);
            this.children.push(ui);

        }
    }
    reset() {
        this.children.forEach(ui => {
            if (ui != null && ui.type.name == "inventory") {
                ui.reset();
            }
        });
    }
    update(gl, time, deltaTime, keys) {
        if (this.popup != null) {
            this.popup.update(gl, time, deltaTime, keys);
        }
        for (let i = 1; i < 6; i++) {
            if(this.children[i].hover){
                this.children[i].off[1] = 0.15;
                if(this.children[i].click){
                    this.children[i].off[1] = 0.05;
                }
            }

        }
    }
    add(gl) {
        if (this.popup == null) {
            this.popup = new wacamolGame(gl);
        }
    }
}
class wacamolGame {
    constructor(gl) {
        this.children = [];
        var ui = new SpObj(gl, [4, 0.5, 0], [0, 0, 0], [3.5, 3.5, 1], "inventory", initCubeBuffer(gl, [9]));
        this.children.push(ui);

        this.timerb1 = Math.random() * 3;
        this.gob1 = new SpObj(gl, [2, 1, 0], [0, 0, 0], [1, 1, 1], "goblin", initCubeBuffer(gl, [9]));
        this.gob1.textOff[2] = 1 / 3;
        this.children.push(this.gob1);

        this.timerb2 = Math.random() * 3;
        this.gob2 = new SpObj(gl, [6, 1, 0], [0, 0, 0], [1, 1, 1], "goblin", initCubeBuffer(gl, [9]));
        this.gob2.textOff[2] = 1 / 3;
        this.children.push(this.gob2);

        this.timerb3 = Math.random() * 3;
        this.gob3 = new SpObj(gl, [4, -2, 0], [0, 0, 0], [1, 1, 1], "goblin", initCubeBuffer(gl, [9]));
        this.gob3.textOff[2] = 1 / 3;
        this.children.push(this.gob3);
        
        this.hover = false;
        this.click = false;
        this.type = {name:"popup", children:true}
    }
    update(gl, time, deltaTime, keys) {
        this.timerb1 -= deltaTime;
        if (this.timerb1 < 0) {
            if (this.gob1.textOff[0] == 0) {
                this.timerb1 = 1;
                this.gob1.textOff[0] = 1;
            } else {
                this.timerb1 = Math.random() * 3;
                this.gob1.textOff[0] = 0;
            }

        } else {
            if (this.gob1.textOff[0] == 1 && this.gob1.click) {
                this.gob1.textOff[0] = 2;

                this.timerb1 = 0.2;
            }
            this.gob1.click = false;
        }
        this.timerb2 -= deltaTime;
        if (this.timerb2 < 0) {
            if (this.gob2.textOff[0] == 0) {
                this.timerb2 = 1;
                this.gob2.textOff[0] = 1;
            } else {
                this.timerb2 = Math.random() * 3;
                this.gob2.textOff[0] = 0;
            }

        } else {
            if (this.gob2.textOff[0] == 1 && this.gob2.click) {
                this.gob2.textOff[0] = 2;

                this.timerb2 = 0.2;
            }
            this.gob2.click = false;
        }
        this.timerb3 -= deltaTime;
        if (this.timerb3 < 0) {
            if (this.gob3.textOff[0] == 0) {
                this.timerb3 = 1;
                this.gob3.textOff[0] = 1;
            } else {
                this.timerb3 = Math.random() * 3;
                this.gob3.textOff[0] = 0;
            }

        } else {
            if (this.gob3.textOff[0] == 1 && this.gob3.click) {
                this.gob3.textOff[0] = 2;

                this.timerb3 = 0.2;
            }
            this.gob3.click = false;
        }
    }
}
class inventoryUI {
    constructor(gl, pos) {
        this.item = null;
        this.hover = false;
        this.click = false;
        this.type = {name:"inventory", children:false}
        this.obj = new SpObj(gl, pos, [0, 0, 0], [0.75, 0.75, 1], "marker", initCubeBuffer(gl, [9]));
        this.obj.textOff[2] = 0.5;
        this.off = [0, 0];
    }
    drawScene(gl, program) {
        this.obj.pos[0] += this.off[0];
        this.obj.pos[1] += this.off[1];
        this.obj.drawScene(gl, program);
        this.obj.pos[0] -= this.off[0];
        this.obj.pos[1] -= this.off[1];
    }
    reset() {
        this.off = [0, 0];
    }
}

export { UImannager }