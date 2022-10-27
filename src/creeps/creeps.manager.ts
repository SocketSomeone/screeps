export class CreepsManager {
    public static createCreeps() {
        for (const spawnName in Game.spawns) {
            const spawn = Game.spawns[spawnName];
            HarvesterRole.createIfNeed(spawn);
            UpgraderRole.createIfNeed(spawn);
            BuilderRole.createIfNeed(spawn);
            RepairerRole.createIfNeed(spawn);
        }
    }

    public static run() {}
}
