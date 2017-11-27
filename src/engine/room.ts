import { Actor, ActorInstance, CollisionCallback } from './actor';
import { GameCanvasContext, RoomDrawEvent } from './canvas';
import { Key } from './enum';
import { EventHandler, Input, PointerInputEvent } from './input';
import { RoomBehavior } from './room-ext';
import { Sprite } from './sprite';
import { GameLifecycleCallback, Vastgame } from './vastgame';

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
    private behaviors: RoomBehavior[] = [];

    private onStartCallback: GameLifecycleCallback;
    private onDrawCallback: RoomDrawEvent;
    
    background: Background;

    setBackground(color: string, width: number, height: number, pageColor?: string): void {
        this.background = new Background(color, pageColor, width, height);

        if (pageColor) {
            document.body.style.backgroundColor = pageColor;
        }
    }

    end(): void {
        this.actorInstanceMap = {};
        this.behaviors = [];
        this.eventHandlers.forEach(eventHandler => eventHandler.dispose());
    }

    // mix-in behaviors
    use(behavior: RoomBehavior): RoomBehavior {
        this.behaviors.push(behavior);
        return behavior;
    }

    // lifecycle callbacks
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

    // event callbacks
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

    // step behavior
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

        this.behaviors.forEach(behavior => behavior.postStep(this));
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

    // draw behavior
    draw(canvasContext: GameCanvasContext): void {
        // call pre-draw behaviors
        this.behaviors.forEach(behavior => behavior.preDraw(this, canvasContext));

        // draw room background
        if (this.background) {
            canvasContext.fill(this.background.width, this.background.height, this.background.color);
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
                canvasContext.drawSprite(instance.animation.source, instance.x, instance.y, instance.spriteAnimation.frame);
            }
        });
    }

    drawSprite(sprite: Sprite, x: number, y: number, frame: number = 0) {
        let canvas = Vastgame.getContext().getCanvas();
        let canvasContext = canvas.getContext();

        // call pre-draw behaviors
        this.behaviors.forEach(behavior => behavior.preDraw(this, canvasContext));

        canvasContext.drawSprite(sprite, x, y, frame);
    }

    handleClick(event: PointerInputEvent): void {
        // call pre-click behaviors
        this.behaviors.forEach(behavior => behavior.preHandleClick(event));
        
        // pass click event to actor instances
        let clickX = event.x;
        let clickY = event.y;

        this.getInstancesAtPosition(clickX, clickY).forEach(instance => {
            let parent = instance.parent;

            if (parent.hasClick && instance.occupiesPosition(clickX, clickY)) {
                parent.callClick(instance, event);
            }
        });

        // call post-click behaviors
        this.behaviors.forEach(behavior => behavior.postHandleClick(event));
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
}
