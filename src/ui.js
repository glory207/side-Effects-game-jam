import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";
import { loadTexture } from "./init-texture.js";

import { ingredients } from "./ingredient.js";
class UImannager {
    constructor(gl) {
        this.hover = false;
        this.click = false;
        this.type = { name: "UI", children: true }
        this.children = [];
        this.children.push(null);
        var ui;
        ui = new inventoryUI(gl, [(0 - 2) * 0.7 * 2, -3.783, 0]);
        ui.obj.texture = loadTexture(gl, "hand");
        ui.id = 1;
        this.children.push(ui);
        for (let i = 1; i < 5; i++) {
            ui = new inventoryUI(gl, [(i - 2) * 0.7 * 2, -3.783, 0]);
            ui.id = i + 1;
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
                if (this.children[0] == null) this.children[0] = new chopper(gl);
                break
            case "chest":
                if (this.children[0] == null) this.children[0] = new ChestVeiw(gl);
                break
            case "book":
                keys["lock"] = "";
                break
            case "furnace":
                if (this.children[0] == null) this.children[0] = new pumper(gl);
                break
            case "pot":
                for (var i = 0; i < 6; i++) keys["inventory"][i] = null;
                keys["inventory"][1] = Object.assign({}, ingredients.CyclopsEye);
                keys["inventory"][1].name = "potion";
                keys["lock"] = "";
                break
            case "cash":
                if (this.children[0] == null) this.children[0] = new takeOrder(gl);
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
            if (keys["inventory"][this.children[i].id] != null) {
                this.children[i].obj2.texture = loadTexture(gl, keys["inventory"][this.children[i].id].name);
            } else {
                this.children[i].obj2.texture = this.children[i].obj.texture;
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

        this.progressover = new SpObj(gl, [4, 3, 0], [0, 0, 0], [0, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressover.textOff[2] = 0.5;
        this.progressover.textOff[0] = 1;
        this.children.push(this.progressover);

        this.progressunder = new SpObj(gl, [4, 3, 0], [0, 0, 0], [3, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressunder.textOff[2] = 0.5;
        this.children.push(this.progressunder);
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
                this.progressover.sca[0] += 0.2
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
                this.progressover.sca[0] += 0.2
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
                this.progressover.sca[0] += 0.2
                this.timerb3 = 0.2;
            }
            this.gob3.click = false;
        }
        if (this.progressover.sca[0] > 3) {
            if (keys["inventory"][1] != null) {
                keys["inventory"][1].name = "blob";
            }
            keys["lock"] = "";
        }
    }
}
class pumper {
    constructor(gl) {

        this.children = [];
        var ui = new SpObj(gl, [4, 0.5, 0], [0, 0, 0], [3.5, 3.5, 1], "inventory", initCubeBuffer(gl, [9]));
        this.children.push(ui);
        this.progressover = new SpObj(gl, [4, 3, 0], [0, 0, 0], [0, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressover.textOff[2] = 0.5;
        this.progressover.textOff[0] = 1;
        this.children.push(this.progressover);

        this.progressunder = new SpObj(gl, [4, 3, 0], [0, 0, 0], [3, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressunder.textOff[2] = 0.5;
        this.children.push(this.progressunder);
        this.hover = false;
        this.click = false;
        this.type = { name: "pumper", children: true }


        this.target = Math.random();
        this.timer = -5;

        this.pos = 0;
        this.vel = 0;

        this.pump = new SpObj(gl, [4, -2, 0], [0, 0, 0], [-1, 1, 1], "bellow", initCubeBuffer(gl, [9]));
        this.pump.textOff[2] = 0.5;
        this.children.push(this.pump);

        this.arrow = new SpObj(gl, [2, 1, 0], [0, 0, -Math.PI / 2], [0.5, 0.5, 1], "arrow", initCubeBuffer(gl, [9]));
        this.children.push(this.arrow);

        this.trg = new SpObj(gl, [6, 1, 0], [0, 0, 0], [0.5, 0.5, 1], "ok", initCubeBuffer(gl, [9]));
        this.children.push(this.trg);
    }
    update(gl, time, deltaTime, keys) {
        this.timer -= deltaTime;
        if (this.timer < 0) {
            this.target = Math.random();
            this.timer = Math.random() * 3;
        }
        this.vel -= 3 * deltaTime + this.vel * deltaTime;
        this.pos += this.vel * deltaTime;
        if (this.pos < 0) this.pos = 0;
        if (this.pos > 1) this.pos = 1;
        this.arrow.pos[1] = -1.5 + this.pos * 3;
        this.trg.pos[1] = -1.5 + this.target * 3;



        this.children.forEach(e => {
            if (e.click) {
                this.vel = 1;
            }
            if (keys["mouseDown"]) {
                this.pump.textOff[0] = 1;
            } else {

                this.pump.textOff[0] = 0;
            }
        });

        if (Math.abs(this.target - this.pos) < 0.15) {
            this.progressover.sca[0] += deltaTime * 0.25;
        }
        if (this.progressover.sca[0] > 3) {
            if (keys["inventory"][1] != null) {
                keys["inventory"][1].name = "blob";
            }
            keys["lock"] = "";
        }
    }
}

class chopper {
    constructor(gl) {

        this.children = [];
        var ui = new SpObj(gl, [4, 0.5, 0], [0, 0, 0], [3.5, 3.5, 1], "inventory", initCubeBuffer(gl, [9]));
        this.children.push(ui);
        this.progressover = new SpObj(gl, [4, 3, 0], [0, 0, 0], [0, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressover.textOff[2] = 0.5;
        this.progressover.textOff[0] = 1;
        this.children.push(this.progressover);

        this.progressunder = new SpObj(gl, [4, 3, 0], [0, 0, 0], [3, 1, 1], "progressbar", initCubeBuffer(gl, [9]));
        this.progressunder.textOff[2] = 0.5;
        this.children.push(this.progressunder);
        this.hover = false;
        this.click = false;
        this.type = { name: "chopper", children: true }


        this.target = Math.random();
        this.timer = -5;

        this.pos = 0;
        this.vel = 1;


        this.arrow = new SpObj(gl, [2, 1, 0], [0, 0, -Math.PI / 2], [0.5, 0.5, 1], "arrow", initCubeBuffer(gl, [9]));
        this.children.push(this.arrow);

        this.trg = new SpObj(gl, [6, 1, 0], [0, 0, 0], [0.5, 0.5, 1], "ok", initCubeBuffer(gl, [9]));
        this.children.push(this.trg);
    }
    update(gl, time, deltaTime, keys) {
        this.timer -= deltaTime;
        if (this.timer < 0) {
            this.target = Math.random();
            this.timer = Math.random() * 3;
        }
        this.pos += this.vel * deltaTime;

        this.arrow.pos[1] = -1.5 + Math.pow(Math.sin(this.pos), 2) * 3;
        this.trg.pos[1] = -1.5 + this.target * 3;



        this.children.forEach(e => {
            if (e.click) {
                this.vel *= -1;

                if (Math.abs(this.target - Math.pow(Math.sin(this.pos), 2)) < 0.15) {
                    this.progressover.sca[0] += 0.2;
                }
            }


        });

        if (this.progressover.sca[0] > 3) {
            if (keys["inventory"][1] != null) {
                keys["inventory"][1].name = "blob";
            }
            keys["lock"] = "";
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
                ui.id = i + j * 4 + 6;
                this.children.push(ui);
            }
        }
        this.hover = false;
        this.click = false;
        this.type = { name: "ChestVeiw", children: true }
    }
    update(gl, time, deltaTime, keys) {
        for (let i = 1; i < 17; i++) {
            if (this.children[i].click) {
                
                keys["inventory"][0] = keys["inventory"][this.children[i].id];
            }
            if (keys["inventory"][this.children[i].id] != null) {
                this.children[i].obj2.texture = loadTexture(gl, keys["inventory"][this.children[i].id].name);
            } else {
                this.children[i].obj2.texture = this.children[i].obj.texture;
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
    }
    drawScene(gl, program) {

        this.obj.drawScene(gl, program);
        this.obj2.drawScene(gl, program);

    }

}

class takeOrder {
    constructor(gl) {

        this.children = [];
        var ui = new SpObj(gl, [4, 0.5, 0], [0, 0, 0], [3.5, 3.5, 1], "inventory", initCubeBuffer(gl, [9]));
        this.children.push(ui);

        this.hover = false;
        this.click = false;
        this.type = { name: "chopper", children: true }

        this.ok = new SpObj(gl, [6, -2, 0], [0, 0, 0], [1, 1, 1], "ok", initCubeBuffer(gl, [9]));
        this.children.push(this.ok);
        this.no = new SpObj(gl, [2, -2, 0], [0, 0, 0], [1, 1, 1], "no", initCubeBuffer(gl, [9]));
        this.children.push(this.no);

        this.pre1 = new SpObj(gl, [2, 2, 0], [0, 0, 0], [0.75, 0.2, 1], "adders", initCubeBuffer(gl, [9]));
        this.pre1.textOff[2] = 1 / 4;
        this.children.push(this.pre1);

        this.post1 = new SpObj(gl, [3.5, 2, 0], [0, 0, 0], [0.75, 0.2, 1], "effects", initCubeBuffer(gl, [9]));
        this.post1.textOff[2] = 1 / 12;
        this.post1.textOff[3] = 1 / 2;
        this.children.push(this.post1);

        this.pre2 = new SpObj(gl, [2, 1.6, 0], [0, 0, 0], [0.75, 0.2, 1], "adders", initCubeBuffer(gl, [9]));
        this.pre2.textOff[2] = 1 / 4;
        this.children.push(this.pre2);

        this.post2 = new SpObj(gl, [3.5, 1.6, 0], [0, 0, 0], [0.75, 0.2, 1], "effects", initCubeBuffer(gl, [9]));
        this.post2.textOff[2] = 1 / 12;
        this.post2.textOff[3] = 1 / 2;
        this.children.push(this.post2);

        this.pre3 = new SpObj(gl, [2, 1.2, 0], [0, 0, 0], [0.75, 0.2, 1], "adders", initCubeBuffer(gl, [9]));
        this.pre3.textOff[2] = 1 / 4;
        this.children.push(this.pre3);

        this.post3 = new SpObj(gl, [3.5, 1.2, 0], [0, 0, 0], [0.75, 0.2, 1], "effects", initCubeBuffer(gl, [9]));
        this.post3.textOff[2] = 1 / 12;
        this.post3.textOff[3] = 1 / 2;
        this.post3.textOff[1] = 1;
        this.children.push(this.post3);


    }
    update(gl, time, deltaTime, keys) {
        if (this.ok.click) { keys["accept"] = true; keys["lock"] = ""; }
        if (this.no.click) { keys["regect"] = true; keys["lock"] = ""; }
        if (keys["offer"] != null) {
            this.pre1.textOff[0] = keys["offer"][0];
            this.post1.textOff[0] = keys["offer"][1];

            this.pre2.textOff[0] = keys["offer"][2];
            this.post2.textOff[0] = keys["offer"][3];

            this.pre3.textOff[0] = keys["offer"][4];
            this.post3.textOff[0] = keys["offer"][5];
        }
    }
}

export { UImannager }