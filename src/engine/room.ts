import { Actor, ActorInstance } from './actor';
import { ClickEvent } from './canvas';
import { GameLifecycleCallback } from './vastgame';
import { Grid } from './grid';
import { Util } from './util';
import { View } from './view';

export class Room {

    private static nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static define(): Room {
        return new Room();
    }

    private readonly actorInstanceMap = new Map<number, ActorInstance>();

    private grid: Grid;
    private view: View;

    _onStart: GameLifecycleCallback;

    onStart(callback: GameLifecycleCallback): void {
        this._onStart = callback;
    }

    defineGrid(tileSize: number): Grid {
        this.grid = new Grid(tileSize, this);

        return this.grid;
    }

    defineView(x: number, y: number, width: number, height: number): View {
        this.view = new View(x, y, width, height);

        return this.view;
    }

    step(): void {

        this.getInstances().forEach(instance => {
            let parent = instance.parent;
            let hasCollisionHandler = !!parent.collisionHandlers.size;

            if (instance.isActive) {
                // apply actor instance movement
                if (instance.speed !== 0) {
                    this.applyInstanceMovement(instance);
                }

                // call collision handlers
                if (hasCollisionHandler) {
                    this.checkCollisions(instance);
                }

                // call actor 'step' callbacks
                if (instance._onStep) {
                    instance._onStep(instance);
                }

                // internal 'post-step'
                instance.onPostStep();
            }
            else {
                // destroy instance
                instance.parent.destroyInstance(instance.id);
                this.actorInstanceMap.delete(instance.id);
            }
        });

        // update view posiition
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
        let parent = selfInstance.parent;
        
        Util.arrayFromMap(parent.collisionHandlers).forEach(kvp => {
            let [otherActorName, callback] = kvp;
            let otherActor = Actor.get(otherActorName);

            otherActor.instanceMap.forEach(other => {
                if (selfInstance !== other && selfInstance.collidesWith(other)) {
                    callback(selfInstance, other);
                }
            });
        });
    }

    createActor(actorConfig: Actor, x?: number, y?: number): ActorInstance {
        let newActorInstanceID = Room.nextActorInstanceID();
        let newInstance: ActorInstance = actorConfig.createInstance(newActorInstanceID, x, y);

        this.actorInstanceMap.set(newActorInstanceID, newInstance);

        return newInstance;
    }

    getInstances(): ActorInstance[] {
        return Util.valuesFromMap(this.actorInstanceMap);
    }

    getInstancesAtPosition(x: number, y: number): ActorInstance[] {
        return this.getInstances().filter(instance => instance.occupiesPosition(x, y));
    }

    getView(): View {
        return this.view;
    }

    handleClick(event: ClickEvent): void {
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
            let onClick = instance.parent._onClick;

            if (onClick && instance.occupiesPosition(clickX, clickY)) {
                onClick(instance, event);
            }
        });
    }
}
