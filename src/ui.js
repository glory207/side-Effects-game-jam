import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";
import { loadTexture } from "./init-texture.js";

class UImannager {
    constructor(gl) {
        this.hover = false;
        this.click = false;
        this.type = { name: "UI", children: true }
        this.children = [];
        this.children.push(null);
        var ui;
        ui = new inventoryUI(gl, [(0 - 2) * 0.7 * 2, -3.783, 0]);
        ui.obj.textOff[0] = 1;
        ui.id = 1;
        this.children.push(ui);
        for (let i = 1; i < 5; i++) {
            ui = new inventoryUI(gl, [(i - 2) * 0.7 * 2, -3.783, 0]);
            ui.id = i+1;
            this.children.push(ui);
        }
    }

    update(gl, time, deltaTime, keys) {

        switch (keys["lock"]) {
            case "":
                this.children[0] = null;
                break;
            case "pestle":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break
            case "choppingboard":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break
            case "chest":
                if (this.children[0] == null) this.children[0] = new ChestVeiw(gl);
                break
            case "book":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break
            case "furnace":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break
            case "pot":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break
            case "cash":
                if (this.children[0] == null) this.children[0] = new wacamolGame(gl);
                break

            default:
                break;
        }

        if (this.children[0] != null) {
            this.children[0].update(gl, time, deltaTime, keys);
        }
        for (let i = 1; i < 6; i++) {
            if (this.children[i].click) {
               var temp = keys["inventory"][this.children[i].id];
               keys["inventory"][this.children[i].id] = keys["inventory"][0];
               keys["inventory"][0] = temp;
            }
            if(keys["inventory"][this.children[i].id] != null){
                this.children[i].obj2.texture = loadTexture(gl,keys["inventory"][this.children[i].id].name);
                this.children[i].obj2.textOff[2] = 1;
            }else{
                this.children[i].obj2.texture = loadTexture(gl,"marker");
                this.children[i].obj2.textOff[2] = 0.5;
            }
        }
    }
    add(gl) {
        if (this.children[0] == null) {
            this.children[0] = new wacamolGame(gl);
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
        this.type = { name: "wacamolGame", children: true }
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
class ChestVeiw {
    constructor(gl) {
        this.children = [];
        var ui = new SpObj(gl, [4, 0.5, 0], [0, 0, 0], [3.5, 3.5, 1], "inventory", initCubeBuffer(gl, [9]));
        this.children.push(ui);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                ui = new inventoryUI(gl, [1.75 + i * 1.5, -1.75 + j * 1.5, 0]);
                ui.id = i + j*4 + 6;
                this.children.push(ui);
            }
        }
        this.hover = false;
        this.click = false;
        this.type = { name: "ChestVeiw", children: true }
    }
    update(gl, time, deltaTime, keys) {
        for(let i = 1; i < 17; i++){
            if (this.children[i].click) {
               var temp = keys["inventory"][this.children[i].id];
               keys["inventory"][this.children[i].id] = keys["inventory"][0];
               keys["inventory"][0] = temp;
            }
            if(keys["inventory"][this.children[i].id] != null){
                this.children[i].obj2.texture = loadTexture(gl,keys["inventory"][this.children[i].id].name);
                this.children[i].obj2.textOff[2] = 1;
            }else{
                this.children[i].obj2.texture = loadTexture(gl,"marker");
                this.children[i].obj2.textOff[2] = 0.5;
            }
        }
    }
}
class inventoryUI {
    constructor(gl, pos, id) {
        this.id = id;
        this.hover = false;
        this.click = false;
        this.type = { name: "inventory", children: false }
        this.obj = new SpObj(gl, pos, [0, 0, 0], [0.75, 0.75, 1], "marker", initCubeBuffer(gl, [9]));
        this.obj2 = new SpObj(gl, pos, [0, 0, 0], [0.75, 0.75, 1], "marker", initCubeBuffer(gl, [9]));
        this.obj.textOff[2] = 0.5;
    }
    drawScene(gl, program) {
        
        this.obj.drawScene(gl, program);
        this.obj2.drawScene(gl, program);
        
    }

}

export { UImannager }