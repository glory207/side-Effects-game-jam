import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";

function shouldRemove(val) {
    return !val.remove;
}
// this class will handle adding and deleting npcs giving them orders making them move etc
class innit_npcManager {
    constructor() {
        this.children = [];
        this.curid = 0;
        this.lineid = 0;

        this.hover = false;
        this.click = false;
        this.type = { name: "npc", children: true }
    }
    add(gl) {
        var npc = new innit_npc(gl);
        npc.id = this.curid;
        this.curid += 1;

        this.children.push(npc);
    }

    drawScene(gl, programInfo) {
        this.children.forEach(npc => {
            npc.obj.drawScene(gl, programInfo);
        });
    }


    update(gl, time, deltaTime, keys) {
        
        this.children.forEach(npc => {
            if (npc.click) {
                
                if (npc.wander && !npc.leave) {
                    npc.leave = true;
                    npc.target = [0, 10];
                } else if (npc.id == this.lineid) {
                    this.lineid += 1;
                }
            }
            if (npc.leave && npc.pos[0] > -6) {
                npc.target = [-50, 10];

            }
            else if (npc.leave && npc.pos[0] < -44) {
                npc.remove = true;
            } else {
                var spot = npc.id - this.lineid;
                if (spot >= 0) {
                    npc.target = [-5 - (spot % 12) * 3.5, -15];
                } else {
                    npc.wander = true;
                }
            }
            npc.update(gl, time, deltaTime, keys);
        });
        this.children = this.children.filter(shouldRemove);

        for (var i = 0; i < this.children.length; i++) {
            for (var j = 0; j < this.children.length; j++) {
                if (i != j) {
                    var move = [this.children[i].pos[0] - this.children[j].pos[0], this.children[i].pos[1] - this.children[j].pos[1]];
                    var len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
                    if (len < 3) {

                        move[0] = (move[0] / len) * 3.0 / 2.0;
                        move[1] = (move[1] / len) * 3.0 / 2.0;
                        this.children[i].vel[0] += move[0] * deltaTime * 120;
                        this.children[i].vel[1] += move[1] * deltaTime * 120;
                        this.children[j].vel[0] -= move[0] * deltaTime * 120;
                        this.children[j].vel[1] -= move[1] * deltaTime * 120;
                    }
                }
            }
        }
    }
}

class innit_npc {
    constructor(gl) {
        this.leave = false;
        this.wander = false;
        this.remove = false;
        this.timer = -5.0;
        this.id = 0;
        this.pos = [-35, 0];
        this.target = [-20, 0];
        this.vel = [10, 0];
        this.acc = [10, 0];
        this.rot = [0, 3, 0];
        this.sca = [2, 7, 2];
        this.obj = new SpObj(gl, [this.pos[0], 7.1, this.pos[1]], this.rot, [2, 7, 2], "player", initCubeBuffer(gl, [9]));

        this.obj.textOff = [0, 0, 1 / 6, 1 / 4];

        this.hover = false;
        this.click = false;
        this.type = { name: "NPC", children: false }
    }
    drawScene(gl, programInfo) {
        this.obj.drawScene(gl, programInfo);
    }
    update(gl, time, deltaTime, keys) {
        this.timer -= deltaTime;
        if (!this.leave && this.wander && this.timer < 0) {
            this.target = [Math.random() * -30 - 5, Math.random() * 70 - 35]
            this.timer = Math.random() * 5 + 1;
        }
        var move = [this.target[0] - this.pos[0], this.target[1] - this.pos[1]];
        var len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
        var rot = (20 * Math.PI) / 180;
        // normalize the movement input and rotate it by the camera angle
        if (len > 1) {
            move[0] /= len;
            move[1] /= len;

        } else {
            move[0] = 0;
            move[1] = 0;

        }
        // move the player by applying acceleration, velocity, and friction
        var m0 = (move[0] * Math.cos(rot) - move[1] * Math.sin(rot));
        var m1 = (move[0] * Math.sin(rot) + move[1] * Math.cos(rot));
        if (m1 < -0.2) {
            this.obj.textOff[1] = 3;
            this.obj.textOff[0] = Math.floor(time * 10);
        }
        if (m1 > 0.2) {
            this.obj.textOff[1] = 0;
            this.obj.textOff[0] = Math.floor(time * 10);
        }
        if (m0 < -0.2) {
            this.obj.textOff[1] = 2;
            this.obj.textOff[0] = Math.floor(time * 10);
        }
        if (m0 > 0.2) {
            this.obj.textOff[1] = 1;
            this.obj.textOff[0] = Math.floor(time * 10);
        }
        // move the npc by applying acceleration, velocity, and friction
        this.acc[0] = move[0] * 10;
        this.acc[1] = move[1] * 10;

        this.vel[0] += this.acc[0] - this.vel[0] * 20 * deltaTime;
        this.vel[1] += this.acc[1] - this.vel[1] * 20 * deltaTime;

        this.pos[0] += this.vel[0] * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;

        if (this.pos[0] > -5) this.pos[0] = -5;
        //if (this.pos[0] < -40) this.pos[0] = -40;
        if (this.pos[1] > 35) this.pos[1] = 35;
        if (this.pos[1] < -35) this.pos[1] = -35;
        this.obj.pos = [this.pos[0], 7.5, this.pos[1]];
    }
}
export { innit_npc, innit_npcManager };