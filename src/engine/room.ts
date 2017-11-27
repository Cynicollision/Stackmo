import { Actor, ActorInstance, CollisionCallback } from './actor';
import { GameCanvasContext, RoomDrawEvent } from './canvas';
import { Key } from './enum';
import { EventHandler, Input, PointerInputEvent } from './input';
import { Grid } from './grid';
import { GameLifecycleCallback } from './vastgame';
import { Sprite } from './sprite';
import { View } from './view';
import { Vastgame } from './vastgame';

export class Background {

    constructor(
        readonly color: string,
        readonly pageColor: string = '#000', 
        readonly width: number, 
        readonly height: number) {
    }
}

export class Room {

    private static nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static define(name: string): Room {
        let room = new Room();
        Vastgame.getContext().defineRoom(name, room);
        return room;
    }

    static get(name: string): Room {
        return Vastgame.getContext().getRoom(name);
    }

    private actorInstanceMap: { [index: number]: ActorInstance } = {};

    private eventHandlers: EventHandler[] = [];
    // TODO: consider moving Grid to extended class or decorator
    private grid: Grid;
    view: View;

    private onStartCallback: GameLifecycleCallback;
    private onDrawCallback: RoomDrawEvent;
    
    background: Background;

    get hasStart(): boolean {
        return !!this.onStartCallback;
    }

    onStart(callback: GameLifecycleCallback): void {
        this.onStartCallback = callback;
    }

    callStart(args?: any): void {
        this.onStartCallback(args);
    }

    get hasDraw(): boolean {
        return !!this.onDrawCallback;
    }

    onDraw(callback: RoomDrawEvent): void {
        this.onDrawCallback = callback;
    }

    callDraw(): void {
        this.onDrawCallback(this);
    }

    onClick(callback: (event: MouseEvent) => void): EventHandler {
        let clickHandler = Input.registerClickHandler(callback);
        this.eventHandlers.push(clickHandler);

        return clickHandler;
    }

    onKey(key: Key, callback: (event: KeyboardEvent) => void): EventHandler {
        let keyHandler = Input.registerKeyHandler(key, callback);
        this.eventHandlers.push(keyHandler);

        return keyHandler;
    }

    defineGrid(tileSize: number): Grid {
        this.grid = new Grid(tileSize, this);

        return this.grid;
    }

    defineView(x: number, y: number, width: number, height: number): View {
        this.view = new View(x, y, width, height);

        return this.view;
    }

    setBackground(color: string, width: number, height: number, pageColor?: string): void {
        this.background = new Background(color, pageColor, width, height);

        if (pageColor) {
            document.body.style.backgroundColor = pageColor;
        }
    }

    step(): void {

        this.getInstances().forEach(instance => {
            let parent = instance.parent;

            if (instance.isActive) {
                // apply actor instance movement
                if (instance.speed !== 0) {
                    this.applyInstanceMovement(instance);
                }

                this.checkCollisions(instance);

                parent.step(instance);
            }
            else {
                this.destroyActorInstance(instance);
            }
        });

        if (this.view) {
            this.view.update();
        }
    }

    private applyInstanceMovement(instance: ActorInstance): void {
        let offsetX = Math.round(instance.getMovementOffsetX());
        let offsetY = Math.round(instance.getMovementOffsetY());

        if (offsetX !== 0 || offsetY !== 0) {
            instance.setPositionRelative(offsetX, offsetY);
        }
    }

    private checkCollisions(selfInstance: ActorInstance): void {
        let parent = selfInstance.parent;;
        
        for (let actorName in parent.collisionHandlers) {
            let callback = parent.collisionHandlers[actorName];
            let otherActor = Actor.get(actorName);

            for (let otherID in this.actorInstanceMap) {
                let other = this.actorInstanceMap[otherID];

                if (other.parent === otherActor) {

                    if (selfInstance !== other && selfInstance.collidesWith(other)) {
                        callback(selfInstance, other);
                    }
                }
            };
        };
    }

    draw(canvasContext: GameCanvasContext): void {
        // get view offset
        let [offsetX, offsetY] = this.getViewOffset();

        // draw room background
        if (this.background) {
            canvasContext.fill(-offsetX, -offsetY, this.background.width, this.background.height, this.background.color);
        }

        // call room draw event callback
        if (this.hasDraw) {
            this.callDraw();
        }

        let orderedInstances = this.getInstances().sort((a, b) => {
            return (b.spriteAnimation ? b.spriteAnimation.depth : 0) - (a.spriteAnimation ? a.animation.depth : 0);
        });

        orderedInstances.forEach(instance => {
            // call actor draw event callbacks
            if (instance.parent.hasDraw) {
                instance.parent.callDraw(instance);
            }

            // draw sprites
            if (instance.animation && instance.visible) {
                canvasContext.drawSprite(instance.animation.source, instance.x - offsetX, instance.y - offsetY, instance.spriteAnimation.frame);
            }
        });
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0) {
        let [offsetX, offsetY] = this.getViewOffset();
        let canvas = Vastgame.getContext().getCanvas();
        canvas.getContext().drawSprite(sprite, x - offsetX, y - offsetY, frame);
    }

    createActor(actorID: string, x?: number, y?: number): ActorInstance {
        let parentActor = Actor.get(actorID);

        let newActorInstanceID = Room.nextActorInstanceID();
        let newInstance = new ActorInstance(this, parentActor, newActorInstanceID, x, y);

        this.actorInstanceMap[newActorInstanceID] = newInstance;

        if (parentActor.hasCreate) {
            parentActor.callCreate(newInstance);
        }

        return newInstance;
    }

    private destroyActorInstance(instance: ActorInstance): void {
        let parent = instance.parent;

        if (parent.hasDestroy) {
            parent.callDestroy(instance);
        }

        delete this.actorInstanceMap[instance.id];
    }

    private getViewOffset(): [number, number] {
        let offsetX = this.view ? this.view.x : 0;
        let offsetY = this.view ? this.view.y : 0;

        return [offsetX, offsetY];
    }

    getInstances(): ActorInstance[] {
        let instances = [];

        for (let instance in this.actorInstanceMap) {
            instances.push(this.actorInstanceMap[instance]);
        }

        return instances;
    }

    getInstancesAtPosition(x: number, y: number): ActorInstance[] {
        return this.getInstances().filter(instance => instance.occupiesPosition(x, y));
    }

    isPositionFree(x: number, y: number): boolean {
        return !this.getInstancesAtPosition(x, y).length;
    }

    getView(): View {
        return this.view;
    }

    handleClick(event: PointerInputEvent): void {
        let clickX = event.x;
        let clickY = event.y;

        if (this.view) {
            clickX += this.view.x;
            clickY += this.view.y;
        }

        if (this.grid) {
            this.grid.raiseClickEvent(clickX, clickY);
        }

        this.getInstancesAtPosition(clickX, clickY).forEach(instance => {
            let parent = instance.parent;

            if (parent.hasClick && instance.occupiesPosition(clickX, clickY)) {
                parent.callClick(instance, event);
            }
        });
    }

    end(): void {
        this.actorInstanceMap = {};
        this.eventHandlers.forEach(eventHandler => eventHandler.dispose());
    }
}
