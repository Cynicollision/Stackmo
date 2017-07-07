import { Actor, ActorInstance, CollisionCallback } from './actor';
import { ClickEvent } from './canvas';
import { GameLifecycleCallback } from './vastgame';
import { Grid } from './grid';
import { View } from './view';

export class Room {

    private static nextActorInstanceID = (() => {
        let currentID = 0;
        return (() => ++currentID);
    })();

    static define(): Room {
        return new Room();
    }

    private readonly actorInstanceMap: { [index: number]: ActorInstance } = {};

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
            let parent = instance.parent;

            if (parent.hasClick && instance.occupiesPosition(clickX, clickY)) {
                parent.callClickCallback(instance, event);
            }
        });
    }
}
