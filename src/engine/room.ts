import { Actor, ActorInstance, CollisionCallback } from './actor';
import { CanvasClickEvent, GameCanvasContext, RoomDrawEvent } from './canvas';
import { Key } from './enum';
import { EventHandler, Input } from './input';
import { GameContext } from './game-context';
import { Grid } from './grid';
import { GameLifecycleCallback } from './vastgame';
import { View } from './view';

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
        GameContext.defineRoom(name, room);
        return room;
    }

    static get(name: string): Room {
        return GameContext.getRoom(name);
    }

    static get current(): Room {
        return GameContext.getCurrentRoom();
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

    callStart(): void {
        this.onStartCallback();
    }

    get hasDraw(): boolean {
        return !!this.onDrawCallback;
    }

    onDraw(callback: RoomDrawEvent): void {
        this.onDrawCallback = callback;
    }

    callDraw(gameCanvasContext: GameCanvasContext): void {
        this.onDrawCallback(gameCanvasContext);
    }

    onClick(callback: (event: MouseEvent) => void) {
        let clickHandler = Input.registerClickHandler(callback);
        this.eventHandlers.push(clickHandler);
    }

    onKey(key: Key, callback: (event: KeyboardEvent) => void) {
        let keyHandler = Input.registerKeyHandler(key, callback);
        this.eventHandlers.push(keyHandler);
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

        // TODO: revisit. add "preStep"?
        // if (this.view) {
        //     this.view.updatePosition();
        // }

        this.getInstances().forEach(instance => {
            let parent = instance.parent;

            if (instance.isActive) {
                // apply actor instance movement
                if (instance.speed !== 0) {
                    this.applyInstanceMovement(instance);
                }

                this.checkCollisions(instance);

                // call actor 'step' callbacks
                if (parent.hasStep) {
                    parent.callStep(instance);
                }

                // internal 'post-step'
                instance.doPostStep();
            }
            else {
                this.destroyActorInstance(instance);
            }
        });

        if (this.view) {
            this.view.updatePosition();
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

    createActor(parentActor: Actor, x?: number, y?: number): ActorInstance {
        let newActorInstanceID = Room.nextActorInstanceID();
        let newInstance = new ActorInstance(parentActor, newActorInstanceID, x, y);

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

    // TODO: remove CanvasClickEvent
    handleClick(event: CanvasClickEvent): void {
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
