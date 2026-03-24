import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";

class innit_scene {
    constructor(gl, char, npcM) {

        this.children = [];
        this.hover = false;
        this.click = false;
        this.type = { name: "npc", children: true };

        this.children.push(char.obj);


        this.children.push(new pestle(gl));
        this.children.push(new choppingboard(gl));
        this.children.push(new chest(gl));
        this.children.push(new book(gl));
        this.children.push(new furnace(gl));
        this.children.push(new pot(gl));
        this.children.push(new cash(gl));

        var obj;

        {

            // front room floor
            obj = new SpObj(gl, [-20, 0, 0], [0, 0, 0], [20, 30, 35], "floor", initCubeBuffer(gl, [11]));
            obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[0] / 10];
            this.children.push(obj);

            // front room wall L
            obj = new SpObj(gl, [-40, 20, 0], [0, 0, 0], [20, 20, 35], "wall", initCubeBuffer(gl, [10]));
            obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[1] / 10];
            this.children.push(obj);

            // front room wall R
            obj = new SpObj(gl, [-20, 20, -35], [0, 0, 0], [20, 20, 35], "wall", initCubeBuffer(gl, [9]));
            obj.textOff = [0, 0, obj.sca[0] / 10, obj.sca[1] / 10];
            this.children.push(obj);

            // window
            obj = new SpObj(gl, [-20, 20, -32], [0, 0, 0], [10, 10, 10], "window", initCubeBuffer(gl, [9]));
            this.children.push(obj);

            // table
            obj = new SpObj(gl, [0, 2.5, 0], [0, 0, 0], [3, 2, 25], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
            obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[2] / 10];
            this.children.push(obj);


            // table2
            obj = new SpObj(gl, [30, 3, 0], [0, 0, 0], [13, 3, 10], "wall", initCubeBuffer(gl, [0, 1, 2, 3, 4, 5]));
            obj.textOff = [0, 0, obj.sca[2], obj.sca[2]];
            this.children.push(obj);


            // back room floor
            obj = new SpObj(gl, [30, 0, 0], [0, 0, 0], [30, 20, 50], "floor", initCubeBuffer(gl, [11]));
            obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[0] / 10];
            this.children.push(obj);

            // back room wall L
            obj = new SpObj(gl, [0, 20, -50 + (50 - 35) / 2], [0, 0, 0], [30, 20, (50 - 35) / 2], "wall", initCubeBuffer(gl, [10]));
            obj.textOff = [0, 0, obj.sca[2] / 10, obj.sca[1] / 10];
            this.children.push(obj);

            // back room wall R
            obj = new SpObj(gl, [30, 20, -50], [0, 0, 0], [30, 20, 50], "wall", initCubeBuffer(gl, [9]));
            obj.textOff = [0, 0, obj.sca[0] / 10, obj.sca[1] / 10];
            this.children.push(obj);

            this.children.push(npcM)
        }
    }
}

class interactable {
    constructor(gl) {
        this.hover = false;
        this.click = false;
        this.obj;
        this.animateAllways = true;
        this.animate = true;
        this.type = { name: "interactable", children: false }
    }

    drawScene(gl, programInfo) {
        this.obj.drawScene(gl, programInfo);
    }

    update(gl, time, deltaTime, keys) {
        var len = Math.sqrt(Math.pow(keys["player"][0] - this.obj.pos[0], 2) + Math.pow(keys["player"][1] - this.obj.pos[2], 2));
        if (len < 15) {
            if(this.click){
                keys["lock"] = this.type.name;
            }
            if (this.hover || keys["lock"] == this.type.name) {
                if (this.animate) this.obj.textOff[0] = Math.floor(time * 10);
                else this.obj.textOff[0] = 1;
                this.obj.textOff[1] = 0;
            } else {
                if (this.animateAllways) { this.obj.textOff[0] = Math.floor(time * 10); this.obj.textOff[1] = 1; }
                else this.obj.textOff[0] = 0;
            }
        }else {
                if (this.animateAllways) { this.obj.textOff[0] = Math.floor(time * 10); this.obj.textOff[1] = 1; }
                else this.obj.textOff[0] = 0;
            }

    }
}

class pestle extends (interactable) {
    constructor(gl) {
        super();
        this.obj = new SpObj(gl, [25, 9 + 5, 8], [0, (0 * Math.PI) / 180, 0], [4, 8, 4], "pestle", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 0, 1.0 / 8.0, 1];
        this.animateAllways = false;
        this.type.name = "pestle";
    }

}

class choppingboard extends (interactable) {
    constructor(gl) {
        super();
        this.obj = new SpObj(gl, [35, 9 + 3, 8], [0, (0 * Math.PI) / 180, 0], [4, 8, 4], "choppingboard", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 0, 1.0 / 5.0, 1];
        this.animateAllways = false;
        
        this.type.name = "choppingboard";
    }

}

class chest extends (interactable) {
    constructor(gl) {
        super();
        this.obj = new SpObj(gl, [10, 8, -35], [0, (45 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 0, 0.5, 1];
        this.animateAllways = false;
        this.animate = false;
        
        this.type.name = "chest";
    }

}

class book extends (interactable) {
    constructor(gl) {
        super();

        this.obj = new SpObj(gl, [10, 10, 45], [0, (45 * Math.PI) / 180, 0], [7, 10, 7], "book", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 0, 0.5, 1];
        this.animateAllways = false;
        this.animate = false;
        
        this.type.name = "book";
    }

}

class furnace extends (interactable) {
    constructor(gl) {
        super();
        this.obj = new SpObj(gl, [30, 15, -35], [0, (0 * Math.PI) / 180, 0], [7, 15, 7], "furnace", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 1, 1 / 6, 1 / 2];
        this.type.name = "furnace";

    }

}

class pot extends (interactable) {
    constructor(gl) {
        super();

        this.obj = new SpObj(gl, [45, 12, -35], [0, (0 * Math.PI) / 180, 0], [7, 15, 7], "pot", initCubeBuffer(gl, [9]));
        this.obj.textOff = [0, 1, 1 / 3, 1];
        this.type.name = "pot";
    }

}

class cash extends (interactable) {
    constructor(gl) {
        super();

        this.obj = new SpObj(gl, [0, 9, -13], [0, 0, 0], [3, 5, 17], "cash", initCubeBuffer(gl, [9]));
        this.type.name = "cash";
    }

}


export { innit_scene };