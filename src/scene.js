import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";

class innit_scene {
    constructor(gl, char, npcM) {

        this.children = [];
        this.hover = false;
        this.click = false;
        this.type = { name: "npc", children: true }

        this.children.push(char.obj);

        // create the scene objects ill just hardcode them in here for now, eventually ill want to load them from a file or something
        var obj;

        obj = new SpObj(gl, [25, 9+5, 8], [0, (0 * Math.PI) / 180, 0], [4, 8, 4], "pestle", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 0, 1.0 / 8.0, 1];
        obj.type = "pestle";
        this.children.push(obj);

        obj = new SpObj(gl, [35, 9+3, 8], [0, (0 * Math.PI) / 180, 0], [4, 8, 4], "choppingboard", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 0, 1.0 / 5.0, 1];
        obj.type = "chopping";
        this.children.push(obj);

        obj = new SpObj(gl, [10, 8, -35], [0, (45 * Math.PI) / 180, 0], [7, 7, 7], "chest", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 0, 0.5, 1];
        obj.type = "chest";
        this.children.push(obj);

        obj = new SpObj(gl, [10, 10, 45], [0, (45 * Math.PI) / 180, 0], [7, 10, 7], "book", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 0, 0.5, 1];
        obj.type = "chest";
        this.children.push(obj);

        obj = new SpObj(gl, [30, 15, -35], [0, (0 * Math.PI) / 180, 0], [7, 15, 7], "furnace", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 1, 1 / 6, 1 / 2];
        obj.type = "chest";
        this.children.push(obj);

        obj = new SpObj(gl, [45, 12, -35], [0, (0 * Math.PI) / 180, 0], [7, 15, 7], "pot", initCubeBuffer(gl, [9]));
        obj.textOff = [0, 1, 1 / 3, 1 ];
        obj.type = "chest";
        this.children.push(obj);



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
        obj.type = "table";
        this.children.push(obj);

        // cash
        obj = new SpObj(gl, [0, 9, -13], [0, 0, 0], [3, 5, 17], "cash", initCubeBuffer(gl, [9]));
        obj.type = "table";
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

export { innit_scene };