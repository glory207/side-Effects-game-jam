import { SpObj } from "../src/object.js";
import { initCubeBuffer } from "../src/innit-buffer.js";

class player {
    constructor(gl) {
        this.pos = [15, 0];
        this.vel = [10, 0];
        this.acc = [10, 0];
        this.rot = [0, 3, 0];
        this.sca = [2, 7, 2];
        this.obj = new SpObj(gl, [this.pos[0], 8, this.pos[1]], this.rot, [2, 7, 2], "player", initCubeBuffer(gl, [9]));
        this.inventory = [null] * 9;
        this.obj.textOff = [0, 0, 1 / 6, 1 / 4];
        this.working = false;
    }

    update(gl, time, deltaTime, keys) {
        var move = [0, 0]
        // get the movement input direction
        if (!this.working) {
            if (keys["w"]) {
                move[1] -= 1;
                this.obj.textOff[1] = 3;
                this.obj.textOff[0] = Math.floor(time * 10);
            }
            if (keys["s"]) {
                move[1] += 1;
                this.obj.textOff[1] = 0;
                this.obj.textOff[0] = Math.floor(time * 10);
            }
            if (keys["a"]) {
                move[0] -= 1;
                this.obj.textOff[1] = 2;
                this.obj.textOff[0] = Math.floor(time * 10);
            }
            if (keys["d"]) {
                move[0] += 1;
                this.obj.textOff[1] = 1;
                this.obj.textOff[0] = Math.floor(time * 10);
            }
        }
        var len = Math.sqrt(move[0] * move[0] + move[1] * move[1]);
        var rot = (-15 * Math.PI) / 180;
        // normalize the movement input and rotate it by the camera angle
        if (len > 0) {
            move[0] /= len*2;
            move[1] /= len;


        }
        // move the player by applying acceleration, velocity, and friction
        this.acc[0] = (move[0] * Math.cos(rot) - move[1] * Math.sin(rot)) * 20;
        this.acc[1] = (move[0] * Math.sin(rot) + move[1] * Math.cos(rot)) * 20;

        this.vel[0] += this.acc[0] - this.vel[0] * 20 * deltaTime;
        this.vel[1] += this.acc[1] - this.vel[1] * 20 * deltaTime;

        this.pos[0] += this.vel[0] * deltaTime;
        this.pos[1] += this.vel[1] * deltaTime;

        if (this.pos[0] < 5) this.pos[0] = 5;
        if (this.pos[0] > 55) this.pos[0] = 55;
        if (this.pos[1] > 45) this.pos[1] = 45;
        if (this.pos[1] < -35) this.pos[1] = -35;

        if(this.pos[1] < 10 && this.pos[1] > -10 && this.pos[0] < 30+13 && this.pos[0] > 30-13 ){
            this.obj.pos = [this.pos[0], 7.5+5, this.pos[1]];
        }else
        this.obj.pos = [this.pos[0], 7.5, this.pos[1]];

    }


}
export { player };